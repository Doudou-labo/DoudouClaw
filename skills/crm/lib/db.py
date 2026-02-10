from __future__ import annotations

import os
import sqlite3
from datetime import datetime
from zoneinfo import ZoneInfo

TZ = ZoneInfo("Europe/Paris")

FOLLOWUP_STATUSES = ("PROCHAINEMENT", "EN_ATTENTE_EXTERNE", "A_FAIRE", "FAIT")


def _workspace_root() -> str:
    # skills/crm/lib/db.py -> skills/crm/lib -> skills/crm -> skills -> workspace
    here = os.path.dirname(os.path.realpath(__file__))
    return os.path.abspath(os.path.join(here, "..", "..", ".."))


def db_path() -> str:
    return os.path.join(_workspace_root(), "data", "crm.sqlite")


def _connect() -> sqlite3.Connection:
    path = db_path()
    os.makedirs(os.path.dirname(path), exist_ok=True)
    con = sqlite3.connect(path)
    con.row_factory = sqlite3.Row
    con.execute("PRAGMA foreign_keys = ON")
    return con


def now_iso() -> str:
    return datetime.now(TZ).isoformat(timespec="seconds")


def ensure_db() -> None:
    with _connect() as con:
        con.execute(
            """
            CREATE TABLE IF NOT EXISTS contacts (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              nom TEXT NOT NULL,
              tel TEXT NOT NULL,
              societe TEXT,
              loueur TEXT,
              notes TEXT,
              tags TEXT,
              created_at TEXT NOT NULL,
              updated_at TEXT NOT NULL
            )
            """
        )
        con.execute(
            """
            CREATE TABLE IF NOT EXISTS interactions (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              contact_id INTEGER NOT NULL,
              type TEXT NOT NULL,
              motif TEXT NOT NULL,
              resume TEXT,
              created_at TEXT NOT NULL,
              FOREIGN KEY(contact_id) REFERENCES contacts(id)
            )
            """
        )
        con.execute(
            """
            CREATE TABLE IF NOT EXISTS followups (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              contact_id INTEGER NOT NULL,
              motif TEXT NOT NULL,
              tel TEXT NOT NULL,
              due_at TEXT,
              status TEXT NOT NULL,
              done_at TEXT,
              created_at TEXT NOT NULL,
              updated_at TEXT NOT NULL,
              FOREIGN KEY(contact_id) REFERENCES contacts(id)
            )
            """
        )
        con.execute("CREATE INDEX IF NOT EXISTS idx_contacts_nom ON contacts(nom)")
        con.execute("CREATE INDEX IF NOT EXISTS idx_contacts_tel ON contacts(tel)")
        con.execute("CREATE INDEX IF NOT EXISTS idx_followups_status ON followups(status)")
        con.execute("CREATE INDEX IF NOT EXISTS idx_followups_due ON followups(due_at)")


def _row_to_dict(row: sqlite3.Row | None) -> dict | None:
    if row is None:
        return None
    return dict(row)


def add_contact(*, nom: str, tel: str, societe: str | None, loueur: str | None, notes: str | None, tags: str | None) -> dict:
    ts = now_iso()
    with _connect() as con:
        cur = con.execute(
            """
            INSERT INTO contacts (nom, tel, societe, loueur, notes, tags, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (nom.strip(), tel.strip(), societe, loueur, notes, tags, ts, ts),
        )
        cid = int(cur.lastrowid)
        row = con.execute("SELECT * FROM contacts WHERE id=?", (cid,)).fetchone()
        return _row_to_dict(row)  # type: ignore


def search_contacts(query: str) -> list[dict]:
    q = (query or "").strip()
    if not q:
        return []
    like = f"%{q}%"
    with _connect() as con:
        rows = con.execute(
            """
            SELECT * FROM contacts
            WHERE nom LIKE ? OR tel LIKE ? OR societe LIKE ? OR loueur LIKE ?
            ORDER BY updated_at DESC
            LIMIT 20
            """,
            (like, like, like, like),
        ).fetchall()
        return [dict(r) for r in rows]


def get_contact(contact_id: int) -> dict | None:
    with _connect() as con:
        row = con.execute("SELECT * FROM contacts WHERE id=?", (int(contact_id),)).fetchone()
        return _row_to_dict(row)


def _resolve_contact(contact_query: str) -> dict:
    q = (contact_query or "").strip()
    if not q:
        raise SystemExit("❌ --contact est requis")

    # ID direct
    if q.isdigit():
        c = get_contact(int(q))
        if not c:
            raise SystemExit("❌ Contact introuvable")
        return c

    matches = search_contacts(q)
    if len(matches) == 1:
        return matches[0]
    if len(matches) == 0:
        raise SystemExit("❌ Aucun contact trouvé. Crée-le d'abord: crm contact add ...")

    # Ambigu
    lines = ["❌ Plusieurs contacts correspondent. Précise l'id:"]
    for c in matches[:10]:
        extra = []
        if c.get("societe"):
            extra.append(f"societe={c['societe']}")
        if c.get("loueur"):
            extra.append(f"loueur={c['loueur']}")
        suffix = (" | " + ", ".join(extra)) if extra else ""
        lines.append(f"  - #{c['id']}: {c['nom']} — {c['tel']}{suffix}")
    raise SystemExit("\n".join(lines))


def log_interaction(*, kind: str, contact_query: str, motif: str, resume: str) -> dict:
    ensure_db()
    c = _resolve_contact(contact_query)
    ts = now_iso()
    with _connect() as con:
        cur = con.execute(
            """INSERT INTO interactions (contact_id, type, motif, resume, created_at)
               VALUES (?, ?, ?, ?, ?)""",
            (c["id"], kind, motif.strip(), (resume or "").strip(), ts),
        )
        iid = int(cur.lastrowid)
        row = con.execute("SELECT * FROM interactions WHERE id=?", (iid,)).fetchone()
        return dict(row)


def add_followup(*, contact_query: str, motif: str, tel: str | None, due_at, status: str) -> dict:
    ensure_db()
    if status not in FOLLOWUP_STATUSES:
        raise SystemExit(f"❌ Statut invalide: {status}")

    c = _resolve_contact(contact_query)
    phone = (tel or c["tel"]).strip()
    due_s = None
    if due_at is not None:
        # due_at is tz-aware datetime
        due_s = due_at.isoformat(timespec="minutes")

    ts = now_iso()
    with _connect() as con:
        cur = con.execute(
            """INSERT INTO followups (contact_id, motif, tel, due_at, status, done_at, created_at, updated_at)
               VALUES (?, ?, ?, ?, ?, NULL, ?, ?)""",
            (c["id"], motif.strip(), phone, due_s, status, ts, ts),
        )
        fid = int(cur.lastrowid)
        row = con.execute(
            """
            SELECT f.*, c.nom as contact_nom
            FROM followups f
            JOIN contacts c ON c.id=f.contact_id
            WHERE f.id=?
            """,
            (fid,),
        ).fetchone()
        return dict(row)


def _parse_iso(dt_s: str) -> datetime:
    # stored as isoformat with tz
    return datetime.fromisoformat(dt_s)


def list_followups(*, mode: str, status: str | None) -> list[dict]:
    ensure_db()
    clauses = []
    params: list = []

    if status:
        clauses.append("f.status = ?")
        params.append(status)

    now = datetime.now(TZ)
    start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    end = start.replace(hour=23, minute=59, second=59)

    if mode == "today":
        # due today OR A_FAIRE created today
        clauses.append(
            "((f.due_at IS NOT NULL AND f.due_at >= ? AND f.due_at <= ?) OR (f.due_at IS NULL AND f.status='A_FAIRE'))"
        )
        params.extend([start.isoformat(timespec="seconds"), end.isoformat(timespec="seconds")])
        clauses.append("f.status != 'FAIT'")
    elif mode == "late":
        clauses.append("f.status != 'FAIT'")
        clauses.append("f.due_at IS NOT NULL AND f.due_at < ?")
        params.append(now.isoformat(timespec="seconds"))
    elif mode == "list":
        clauses.append("1=1")
    else:
        raise SystemExit("❌ mode invalide")

    where = " AND ".join(clauses) if clauses else "1=1"

    with _connect() as con:
        rows = con.execute(
            f"""
            SELECT f.*, c.nom as contact_nom
            FROM followups f
            JOIN contacts c ON c.id=f.contact_id
            WHERE {where}
            ORDER BY 
              CASE WHEN f.due_at IS NULL THEN 1 ELSE 0 END,
              f.due_at ASC,
              f.updated_at DESC
            LIMIT 50
            """,
            tuple(params),
        ).fetchall()
        return [dict(r) for r in rows]


def mark_followup_done(followup_id: int, note: str | None) -> dict | None:
    ensure_db()
    ts = now_iso()
    with _connect() as con:
        row = con.execute("SELECT * FROM followups WHERE id=?", (int(followup_id),)).fetchone()
        if not row:
            return None
        con.execute(
            """UPDATE followups
               SET status='FAIT', done_at=?, updated_at=?
               WHERE id=?""",
            (ts, ts, int(followup_id)),
        )

    if note:
        # Append note as an interaction for traceability
        try:
            # Need contact_id for interaction
            fu = dict(row)
            log_interaction(kind="other", contact_query=str(fu["contact_id"]), motif=f"DONE followup #{followup_id}", resume=note)
        except Exception:
            pass

    with _connect() as con:
        row2 = con.execute("SELECT * FROM followups WHERE id=?", (int(followup_id),)).fetchone()
        return dict(row2) if row2 else None
