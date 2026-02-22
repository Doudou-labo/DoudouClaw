#!/usr/bin/env python3
import argparse
import json
import time
from pathlib import Path

SESSIONS_FILE = Path('/root/.openclaw/agents/main/sessions/sessions.json')
MAP_FILE = Path('/root/.openclaw/workspace/config/discord-channel-labels.json')


def load_json(path: Path):
    if not path.exists():
        return {}
    return json.loads(path.read_text(encoding='utf-8'))


def fmt_age(ms: int) -> str:
    now = int(time.time() * 1000)
    delta = max(0, now - ms)
    mins = delta // 60000
    if mins < 60:
        return f"{mins}m"
    hrs = mins // 60
    if hrs < 48:
        return f"{hrs}h"
    days = hrs // 24
    return f"{days}d"


def extract_channel_id(session_key: str, entry: dict) -> str | None:
    # Priority: explicit lastTo/deliveryContext/origin labels
    candidates = []
    for key in ('lastTo',):
        val = entry.get(key)
        if isinstance(val, str):
            candidates.append(val)
    for parent, child in (('deliveryContext', 'to'), ('origin', 'to'), ('origin', 'label')):
        obj = entry.get(parent)
        if isinstance(obj, dict):
            val = obj.get(child)
            if isinstance(val, str):
                candidates.append(val)

    candidates.append(session_key)

    for c in candidates:
        if 'channel:' in c:
            # examples: channel:1472..., discord:channel:1472...
            tail = c.split('channel:')[-1]
            channel_id = ''.join(ch for ch in tail if ch.isdigit())
            if channel_id:
                return channel_id
    return None


def main():
    ap = argparse.ArgumentParser(description='Affiche les sessions avec labels de salons Discord')
    ap.add_argument('--hours', type=int, default=None, help='Filtrer les sessions mises à jour dans les N dernières heures')
    ap.add_argument('--limit', type=int, default=50, help='Nombre max de sessions à afficher')
    args = ap.parse_args()

    sessions = load_json(SESSIONS_FILE)
    mapping = load_json(MAP_FILE).get('channels', {})

    rows = []
    cutoff = None
    if args.hours is not None:
        cutoff = int(time.time() * 1000) - (args.hours * 3600 * 1000)

    for session_key, entry in sessions.items():
        if not isinstance(entry, dict):
            continue
        updated = int(entry.get('updatedAt', 0) or 0)
        if cutoff and updated < cutoff:
            continue

        channel_id = extract_channel_id(session_key, entry)
        label = mapping.get(channel_id, '(non mappé)') if channel_id else '(hors channel)'
        rows.append({
            'updatedAt': updated,
            'age': fmt_age(updated),
            'sessionKey': session_key,
            'channelId': channel_id or '-',
            'label': label,
            'chatType': entry.get('chatType', '-')
        })

    rows.sort(key=lambda r: r['updatedAt'], reverse=True)
    rows = rows[: max(1, args.limit)]

    print(f"Sessions lues: {len(sessions)} | affichées: {len(rows)}")
    print('-' * 120)
    print(f"{'AGE':<6} {'CHANNEL_ID':<20} {'LABEL':<28} {'TYPE':<8} SESSION_KEY")
    print('-' * 120)
    for r in rows:
        print(f"{r['age']:<6} {r['channelId']:<20} {r['label']:<28} {r['chatType']:<8} {r['sessionKey']}")


if __name__ == '__main__':
    main()
