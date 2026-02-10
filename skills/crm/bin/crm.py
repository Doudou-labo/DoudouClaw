#!/usr/bin/env python3
"""crm — mini CRM local (SQLite)

Stockage: data/crm.sqlite (dans le workspace)
Heure: Europe/Paris

Usage (aperçu):
  crm help
  crm contact add --nom "Dupont" --tel "0612..." [--societe "..."] [--loueur "..."]
  crm contact search "dupont"
  crm contact show <id>

  crm log call --contact "Dupont" --motif "Devis" --resume "..."

  crm followup add --contact "Dupont" --motif "Relance" [--due "YYYY-MM-DD HH:MM"] [--status A_FAIRE|EN_ATTENTE_EXTERNE]
  crm followups today
  crm followups late
  crm followups list [--status ...]

  crm done <followup_id> [--note "..."

"""

from __future__ import annotations

import argparse
import os
import sys
from datetime import datetime
from zoneinfo import ZoneInfo

# Add lib to path
SCRIPT_DIR = os.path.dirname(os.path.realpath(__file__))
sys.path.insert(0, os.path.join(SCRIPT_DIR, "..", "lib"))

from db import (  # noqa: E402
    ensure_db,
    add_contact,
    search_contacts,
    get_contact,
    log_interaction,
    add_followup,
    list_followups,
    mark_followup_done,
    FOLLOWUP_STATUSES,
)

TZ = ZoneInfo("Europe/Paris")


def now_paris() -> datetime:
    return datetime.now(TZ)


def parse_due(s: str | None) -> datetime | None:
    if not s:
        return None
    # Expected: YYYY-MM-DD HH:MM
    try:
        dt = datetime.strptime(s.strip(), "%Y-%m-%d %H:%M")
        return dt.replace(tzinfo=TZ)
    except ValueError:
        raise SystemExit("❌ Format attendu pour --due: YYYY-MM-DD HH:MM (ex: 2026-02-13 14:30)")


def cmd_contact_add(args: argparse.Namespace) -> int:
    ensure_db()
    contact = add_contact(
        nom=args.nom,
        tel=args.tel,
        societe=args.societe,
        loueur=args.loueur,
        notes=args.notes,
        tags=args.tags,
    )
    print(f"✅ Contact créé: #{contact['id']} — {contact['nom']} ({contact['tel']})")
    if contact.get("societe") or contact.get("loueur"):
        print(f"   Société: {contact.get('societe') or '-'} | Loueur: {contact.get('loueur') or '-'}")
    return 0


def cmd_contact_search(args: argparse.Namespace) -> int:
    ensure_db()
    rows = search_contacts(args.query)
    if not rows:
        print("Aucun contact.")
        return 0
    for c in rows:
        extra = []
        if c.get("societe"):
            extra.append(f"societe={c['societe']}")
        if c.get("loueur"):
            extra.append(f"loueur={c['loueur']}")
        suffix = (" | " + ", ".join(extra)) if extra else ""
        print(f"#{c['id']}: {c['nom']} — {c['tel']}{suffix}")
    return 0


def cmd_contact_show(args: argparse.Namespace) -> int:
    ensure_db()
    c = get_contact(args.id)
    if not c:
        print("❌ Contact introuvable")
        return 1
    print(f"#{c['id']} — {c['nom']}")
    print(f"Téléphone: {c['tel']}")
    print(f"Société: {c.get('societe') or '-'}")
    print(f"Loueur: {c.get('loueur') or '-'}")
    if c.get("tags"):
        print(f"Tags: {c['tags']}")
    if c.get("notes"):
        print(f"Notes: {c['notes']}")
    return 0


def cmd_log(args: argparse.Namespace, kind: str) -> int:
    ensure_db()
    it = log_interaction(
        kind=kind,
        contact_query=args.contact,
        motif=args.motif,
        resume=args.resume,
    )
    print(f"📝 Interaction #{it['id']} enregistrée ({it['type']}) pour contact #{it['contact_id']}")
    return 0


def cmd_followup_add(args: argparse.Namespace) -> int:
    ensure_db()
    due_dt = parse_due(args.due)

    status = args.status
    if due_dt is not None:
        status = "PROCHAINEMENT"
    elif status is None:
        status = "A_FAIRE"

    if status not in FOLLOWUP_STATUSES:
        raise SystemExit(f"❌ Statut invalide. Valeurs: {', '.join(FOLLOWUP_STATUSES)}")

    fu = add_followup(
        contact_query=args.contact,
        motif=args.motif,
        tel=args.tel,
        due_at=due_dt,
        status=status,
    )
    due_s = fu.get("due_at") or "-"
    print(f"✅ Relance créée: #{fu['id']} — {fu['status']} — {fu['contact_nom']} ({fu['tel']})")
    print(f"   Motif: {fu['motif']}")
    print(f"   Échéance: {due_s}")
    return 0


def cmd_followups(args: argparse.Namespace, mode: str) -> int:
    ensure_db()
    rows = list_followups(mode=mode, status=args.status)
    if not rows:
        print("Aucune relance.")
        return 0

    for fu in rows:
        due = fu.get("due_at") or "-"
        print(
            f"#{fu['id']} [{fu['status']}] {fu['contact_nom']} — {fu['tel']} | {fu['motif']} | due: {due}"
        )
    return 0


def cmd_done(args: argparse.Namespace) -> int:
    ensure_db()
    fu = mark_followup_done(args.id, note=args.note)
    if not fu:
        print("❌ Relance introuvable")
        return 1
    print(f"✅ Relance #{args.id} marquée FAIT")
    return 0


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(prog="crm", add_help=True)
    sub = p.add_subparsers(dest="cmd")

    # contact
    p_contact = sub.add_parser("contact")
    sub_contact = p_contact.add_subparsers(dest="sub")

    p_c_add = sub_contact.add_parser("add")
    p_c_add.add_argument("--nom", required=True)
    p_c_add.add_argument("--tel", required=True)
    p_c_add.add_argument("--societe")
    p_c_add.add_argument("--loueur")
    p_c_add.add_argument("--notes")
    p_c_add.add_argument("--tags")
    p_c_add.set_defaults(func=cmd_contact_add)

    p_c_search = sub_contact.add_parser("search")
    p_c_search.add_argument("query")
    p_c_search.set_defaults(func=cmd_contact_search)

    p_c_show = sub_contact.add_parser("show")
    p_c_show.add_argument("id", type=int)
    p_c_show.set_defaults(func=cmd_contact_show)

    # log
    p_log = sub.add_parser("log")
    sub_log = p_log.add_subparsers(dest="kind")
    for kind in ("call", "email", "visit", "other"):
        pk = sub_log.add_parser(kind)
        pk.add_argument("--contact", required=True, help="Nom/id/téléphone (recherche)")
        pk.add_argument("--motif", required=True)
        pk.add_argument("--resume", default="")
        pk.set_defaults(func=lambda a, k=kind: cmd_log(a, k))

    # followup
    p_fu = sub.add_parser("followup")
    sub_fu = p_fu.add_subparsers(dest="sub")

    p_fu_add = sub_fu.add_parser("add")
    p_fu_add.add_argument("--contact", required=True)
    p_fu_add.add_argument("--motif", required=True)
    p_fu_add.add_argument("--tel", help="si différent du contact")
    p_fu_add.add_argument("--due", help="YYYY-MM-DD HH:MM (Europe/Paris)")
    p_fu_add.add_argument("--status", help="A_FAIRE | EN_ATTENTE_EXTERNE")
    p_fu_add.set_defaults(func=cmd_followup_add)

    # followups (list)
    p_fus = sub.add_parser("followups")
    sub_fus = p_fus.add_subparsers(dest="mode")
    for mode in ("today", "late", "list"):
        pm = sub_fus.add_parser(mode)
        pm.add_argument("--status", help="Filtrer par statut")
        pm.set_defaults(func=lambda a, m=mode: cmd_followups(a, m))

    # done
    p_done = sub.add_parser("done")
    p_done.add_argument("id", type=int)
    p_done.add_argument("--note")
    p_done.set_defaults(func=cmd_done)

    # help
    sub.add_parser("help")

    return p


def main(argv: list[str]) -> int:
    parser = build_parser()
    if len(argv) <= 1:
        parser.print_help()
        return 0
    args = parser.parse_args(argv[1:])
    if args.cmd in (None, "help"):
        parser.print_help()
        return 0
    if not hasattr(args, "func"):
        parser.print_help()
        return 2
    return int(args.func(args))


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
