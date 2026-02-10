#!/usr/bin/env python3
"""One-way sync: CRM (V2 JSON.age or legacy SQLite) -> Google Tasks.

Source of truth:
- Preferred: CRM V2 chiffré (age): crm/data/tasks.json.age
- Fallback: legacy CRM SQLite: data/crm.sqlite

Target:
- Google Tasks tasklist (default: "OpenClaw") via Maton gateway

Behavior:
- For each CRM task/followup *active* (not done): ensure a corresponding Google Task exists.
- If CRM task becomes done: mark corresponding Google Task completed (if mapped).

Mapping:
- Stored locally in data/crm_google_tasks_map.json (NOT in repo by default)

Usage:
  python3 scripts/crm_to_google_tasks_sync.py --dry-run
  python3 scripts/crm_to_google_tasks_sync.py --apply

Env:
  MATON_API_KEY (required)

Requirements (V2):
- `age` installed
- private key at /root/.config/crm-age.key
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Any
from zoneinfo import ZoneInfo
import urllib.request
import urllib.parse

TZ = ZoneInfo("Europe/Paris")

WORKSPACE = Path(__file__).resolve().parents[1]
CRM_DB = WORKSPACE / "data" / "crm.sqlite"
CRM_V2_TASKS_AGE = WORKSPACE / "crm" / "data" / "tasks.json.age"
CRM_V2_KEY = Path("/root/.config/crm-age.key")
MAP_PATH = WORKSPACE / "data" / "crm_google_tasks_map.json"

GATEWAY_BASE = "https://gateway.maton.ai/google-tasks"


def http_json(method: str, url: str, *, body: dict | None = None) -> dict:
    api_key = os.environ.get("MATON_API_KEY")
    if not api_key:
        raise SystemExit("❌ MATON_API_KEY manquant dans l'environnement")

    data = None
    headers = {"Authorization": f"Bearer {api_key}"}
    if body is not None:
        data = json.dumps(body).encode("utf-8")
        headers["Content-Type"] = "application/json"

    req = urllib.request.Request(url, data=data, method=method)
    for k, v in headers.items():
        req.add_header(k, v)

    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)


def load_map() -> dict[str, Any]:
    if not MAP_PATH.exists():
        return {"version": 1, "updatedAt": None, "tasklistId": None, "map": {}}
    return json.loads(MAP_PATH.read_text(encoding="utf-8"))


def save_map(payload: dict[str, Any]) -> None:
    MAP_PATH.parent.mkdir(parents=True, exist_ok=True)
    payload["updatedAt"] = datetime.now(TZ).isoformat(timespec="seconds")
    MAP_PATH.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def crm_connect():
    """Legacy SQLite CRM."""
    import sqlite3

    if not CRM_DB.exists():
        raise SystemExit(f"❌ DB CRM introuvable: {CRM_DB}")
    con = sqlite3.connect(str(CRM_DB))
    con.row_factory = sqlite3.Row
    return con


def load_v2_tasks() -> list[dict[str, Any]]:
    """Load CRM V2 tasks from age-encrypted JSON without writing plaintext to disk."""
    if not CRM_V2_TASKS_AGE.exists():
        return []
    if not CRM_V2_KEY.exists():
        raise SystemExit(f"❌ Clé age introuvable: {CRM_V2_KEY}")

    import subprocess

    try:
        pt = subprocess.check_output(
            ["age", "-d", "-i", str(CRM_V2_KEY), str(CRM_V2_TASKS_AGE)],
            timeout=20,
        )
    except FileNotFoundError:
        raise SystemExit("❌ `age` n'est pas installé (requis pour CRM V2)")
    except subprocess.CalledProcessError as e:
        raise SystemExit(f"❌ Déchiffrement age a échoué: {e}")

    obj = json.loads(pt)
    tasks = obj.get("tasks") if isinstance(obj, dict) else None
    if not isinstance(tasks, list):
        raise SystemExit("❌ Format CRM V2 inattendu: attendu {tasks:[...]}")
    return tasks


@dataclass
class Followup:
    id: int
    contact_nom: str
    tel: str
    motif: str
    due_at: str | None
    status: str
    updated_at: str


@dataclass
class V2Task:
    id: str
    client_id: str
    description: str
    due_at: str | None
    status: str
    created_at: str | None


def load_followups() -> list[Followup]:
    with crm_connect() as con:
        rows = con.execute(
            """
            SELECT f.id, c.nom as contact_nom, f.tel, f.motif, f.due_at, f.status, f.updated_at
            FROM followups f
            JOIN contacts c ON c.id=f.contact_id
            ORDER BY f.updated_at DESC
            LIMIT 200
            """
        ).fetchall()
    out: list[Followup] = []
    for r in rows:
        out.append(
            Followup(
                id=int(r["id"]),
                contact_nom=str(r["contact_nom"]),
                tel=str(r["tel"]),
                motif=str(r["motif"]),
                due_at=(str(r["due_at"]) if r["due_at"] else None),
                status=str(r["status"]),
                updated_at=str(r["updated_at"]),
            )
        )
    return out


def load_v2_tasks_typed() -> list[V2Task]:
    tasks = load_v2_tasks()
    out: list[V2Task] = []
    for t in tasks:
        out.append(
            V2Task(
                id=str(t.get("id")),
                client_id=str(t.get("clientId")),
                description=str(t.get("description")),
                due_at=(str(t.get("dueAt")) if t.get("dueAt") else None),
                status=str(t.get("status")),
                created_at=(str(t.get("createdAt")) if t.get("createdAt") else None),
            )
        )
    return out


def find_tasklist_id(title: str) -> str:
    resp = http_json("GET", f"{GATEWAY_BASE}/tasks/v1/users/@me/lists?maxResults=250")
    items = resp.get("items", []) or []
    for it in items:
        if it.get("title") == title:
            return it["id"]
    available = ", ".join([it.get("title", "?") for it in items])
    raise SystemExit(f"❌ TaskList '{title}' introuvable. Dispo: {available}")


def format_title_any(prefix: str, crm_id: str, who: str, what: str) -> str:
    return f"[{prefix} {crm_id}] {who} — {what}"


def format_notes_any(prefix: str, who: str | None, tel: str | None, status: str, due_at: str | None) -> str:
    lines = [
        f"Créé automatiquement depuis le CRM OpenClaw ({prefix}).",
        f"Statut CRM: {status}",
    ]
    if who:
        lines.append(f"Contact: {who}")
    if tel:
        lines.append(f"Tel: {tel}")
    if due_at:
        lines.append(f"Échéance CRM: {due_at}")
    return "\n".join(lines)


def parse_due_to_rfc3339(due_at_iso: str | None) -> str | None:
    if not due_at_iso:
        return None
    try:
        dt = datetime.fromisoformat(due_at_iso)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=TZ)
        return dt.isoformat()
    except Exception:
        return None


def tasks_get(tasklist_id: str, task_id: str) -> dict:
    url = f"{GATEWAY_BASE}/tasks/v1/lists/{urllib.parse.quote(tasklist_id, safe='')}/tasks/{urllib.parse.quote(task_id, safe='')}"
    return http_json("GET", url)


def tasks_insert(tasklist_id: str, body: dict) -> dict:
    url = f"{GATEWAY_BASE}/tasks/v1/lists/{urllib.parse.quote(tasklist_id, safe='')}/tasks"
    return http_json("POST", url, body=body)


def tasks_patch(tasklist_id: str, task_id: str, body: dict) -> dict:
    url = (
        f"{GATEWAY_BASE}/tasks/v1/lists/{urllib.parse.quote(tasklist_id, safe='')}/tasks/{urllib.parse.quote(task_id, safe='')}"
        "?fields=id,title,notes,status,due,updated,completed"
    )
    return http_json("PATCH", url, body=body)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--tasklist", default="OpenClaw", help="Nom de la liste Google Tasks cible")
    ap.add_argument("--dry-run", action="store_true", help="Ne rien modifier (par défaut)")
    ap.add_argument("--apply", action="store_true", help="Applique les changements")
    args = ap.parse_args()

    apply = bool(args.apply)
    dry_run = not apply

    state = load_map()

    tasklist_id = state.get("tasklistId")
    if not tasklist_id:
        tasklist_id = find_tasklist_id(args.tasklist)
        state["tasklistId"] = tasklist_id

    mapping: dict[str, Any] = state.get("map", {})

    # Prefer CRM V2 if available
    v2_tasks = load_v2_tasks_typed() if CRM_V2_TASKS_AGE.exists() else []

    changes: list[str] = []

    if v2_tasks:
        # V2 statuses are French strings; "Réalisé" means done.
        active = [t for t in v2_tasks if t.status.lower() != "réalisé".lower()]
        done = [t for t in v2_tasks if t.status.lower() == "réalisé".lower()]

        for t in active:
            key = f"v2:{t.id}"
            title = format_title_any("CRM", f"{t.id}", t.client_id, t.description)
            notes = format_notes_any("V2", t.client_id, None, t.status, t.due_at)
            due = parse_due_to_rfc3339(t.due_at)
            last_marker = t.created_at or t.due_at or t.status

            entry = mapping.get(key)
            if not entry:
                changes.append(f"+ create task for CRM V2 {t.id} ({t.status})")
                if apply:
                    body = {"title": title, "notes": notes}
                    if due:
                        body["due"] = due
                    created = tasks_insert(tasklist_id, body)
                    mapping[key] = {"googleTaskId": created["id"], "lastCrmUpdatedAt": last_marker}
            else:
                last = entry.get("lastCrmUpdatedAt")
                if last != last_marker:
                    changes.append(f"~ update task for CRM V2 {t.id} ({t.status})")
                    if apply:
                        tid = entry["googleTaskId"]
                        patch = {"title": title, "notes": notes}
                        patch["due"] = due if due else None
                        tasks_patch(tasklist_id, tid, patch)
                        entry["lastCrmUpdatedAt"] = last_marker

        for t in done:
            key = f"v2:{t.id}"
            entry = mapping.get(key)
            if not entry:
                continue
            tid = entry.get("googleTaskId")
            if not tid:
                continue
            changes.append(f"✓ complete task for CRM V2 {t.id}")
            if apply:
                tasks_patch(tasklist_id, tid, {"status": "completed"})

    else:
        # Legacy SQLite followups
        followups = load_followups()
        active = [fu for fu in followups if fu.status != "FAIT"]
        done = [fu for fu in followups if fu.status == "FAIT"]

        for fu in active:
            key = f"sql:{fu.id}"
            title = format_title_any("CRM", f"#{fu.id}", fu.contact_nom, fu.motif)
            notes = format_notes_any("SQL", fu.contact_nom, fu.tel, fu.status, fu.due_at)
            due = parse_due_to_rfc3339(fu.due_at)

            entry = mapping.get(key)
            if not entry:
                changes.append(f"+ create task for CRM SQL #{fu.id} ({fu.status})")
                if apply:
                    body = {"title": title, "notes": notes}
                    if due:
                        body["due"] = due
                    created = tasks_insert(tasklist_id, body)
                    mapping[key] = {"googleTaskId": created["id"], "lastCrmUpdatedAt": fu.updated_at}
            else:
                last = entry.get("lastCrmUpdatedAt")
                if last != fu.updated_at:
                    changes.append(f"~ update task for CRM SQL #{fu.id} ({fu.status})")
                    if apply:
                        tid = entry["googleTaskId"]
                        patch = {"title": title, "notes": notes}
                        patch["due"] = due if due else None
                        tasks_patch(tasklist_id, tid, patch)
                        entry["lastCrmUpdatedAt"] = fu.updated_at

        for fu in done:
            key = f"sql:{fu.id}"
            entry = mapping.get(key)
            if not entry:
                continue
            tid = entry.get("googleTaskId")
            if not tid:
                continue
            changes.append(f"✓ complete task for CRM SQL #{fu.id}")
            if apply:
                tasks_patch(tasklist_id, tid, {"status": "completed"})

    if dry_run:
        print("DRY_RUN")
    for c in changes:
        print(c)

    if apply:
        state["map"] = mapping
        save_map(state)
        print(f"✅ Sync appliquée. Mapping: {MAP_PATH}")
    else:
        print("ℹ️ Rien n'a été modifié. Relance avec --apply pour appliquer.")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
