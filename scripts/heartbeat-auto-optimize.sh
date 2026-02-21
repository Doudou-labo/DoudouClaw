#!/usr/bin/env bash
# heartbeat-auto-optimize.sh — Ajustements dynamiques (détection + recommandations)
set -euo pipefail

cd /root/.openclaw/workspace

echo "=== Auto-Optimize Check ($(date -u '+%Y-%m-%d %H:%M UTC')) ==="

AUTH_PROFILES="$HOME/.openclaw/agents/main/agent/auth-profiles.json"
CRON_JOBS="/root/.openclaw/cron/jobs.json"
CRON_RUNS_DIR="/root/.openclaw/cron/runs"

NOW_MS=$(date +%s%3N)
ONE_HOUR_MS=3600000

HAS_SIGNAL=false
RECO=""

# 1) Provider usage: >3 erreurs sur la dernière heure
if [ -f "$AUTH_PROFILES" ]; then
  PROVIDER_ALERTS=$(python3 - <<PY
import json, time
path = "$AUTH_PROFILES"
now = $NOW_MS
window = $ONE_HOUR_MS

try:
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
except Exception:
    raise SystemExit(0)

stats = data.get("usageStats", {})
for profile_key, info in stats.items():
    last_failure = int(info.get("lastFailureAt", 0) or 0)
    if last_failure <= 0 or (now - last_failure) > window:
        continue

    error_count = int(info.get("errorCount", 0) or 0)
    failure_counts = info.get("failureCounts", {}) or {}
    failure_sum = sum(int(v or 0) for v in failure_counts.values())
    effective_errors = max(error_count, failure_sum)

    if effective_errors > 3:
        minutes_ago = int((now - last_failure) / 60000)
        print(f"{profile_key}|{effective_errors}|{minutes_ago}")
PY
)

  if [ -n "${PROVIDER_ALERTS:-}" ]; then
    HAS_SIGNAL=true
    echo "⚠️ Providers en tension (dernière heure):"
    while IFS='|' read -r key count mins; do
      [ -z "${key:-}" ] && continue
      echo "  - $key : ${count} erreurs (~${mins} min)"
      RECO+="• Provider $key en surcharge: réduire temporairement la fréquence des crons qui l'utilisent.\n"
    done <<< "$PROVIDER_ALERTS"
  else
    echo "Providers: pas de surcharge détectée ✅"
  fi
else
  echo "AUTH profiles introuvable: $AUTH_PROFILES"
fi

# 2) Cron patterns: NO_REPLY >5 runs consécutifs
if [ -f "$CRON_JOBS" ] && [ -d "$CRON_RUNS_DIR" ]; then
  NOREPLY_ALERTS=$(python3 - <<PY
import json
from pathlib import Path

jobs_path = Path("$CRON_JOBS")
runs_dir = Path("$CRON_RUNS_DIR")

try:
    jobs_data = json.loads(jobs_path.read_text(encoding="utf-8"))
except Exception:
    raise SystemExit(0)

jobs = {j.get("id"): j for j in jobs_data.get("jobs", []) if j.get("id")}

for job_id, job in jobs.items():
    run_file = runs_dir / f"{job_id}.jsonl"
    if not run_file.exists():
        continue

    lines = [ln.strip() for ln in run_file.read_text(encoding="utf-8", errors="ignore").splitlines() if ln.strip()]
    if not lines:
        continue

    finished = []
    for ln in lines:
        try:
            evt = json.loads(ln)
        except Exception:
            continue
        if evt.get("action") == "finished":
            finished.append(evt)

    if not finished:
        continue

    # regarde les 8 derniers runs
    recent = finished[-8:]
    consec = 0
    for evt in reversed(recent):
        summary = (evt.get("summary") or "").strip()
        if summary == "NO_REPLY":
            consec += 1
        else:
            break

    if consec > 5:
        name = job.get("name", job_id)
        print(f"{job_id}|{name}|{consec}")
PY
)

  if [ -n "${NOREPLY_ALERTS:-}" ]; then
    HAS_SIGNAL=true
    echo "⚠️ Crons possiblement sur-fréquentés (NO_REPLY répétés):"
    while IFS='|' read -r id name consec; do
      [ -z "${id:-}" ] && continue
      echo "  - $name ($id) : ${consec} runs NO_REPLY consécutifs"
      RECO+="• Cron '$name': envisager une baisse de fréquence (NO_REPLY x$consec).\n"
    done <<< "$NOREPLY_ALERTS"
  else
    echo "Crons: pas de pattern NO_REPLY >5 détecté ✅"
  fi
else
  echo "Jobs/runs cron introuvables (check NO_REPLY ignoré)."
fi

# 3) Contexte session (signal léger)
if [ -f "memory/working-buffer.md" ]; then
  echo "Contexte: working-buffer présent ✅"
else
  echo "Contexte: pas de working-buffer détecté (OK si contexte faible)."
fi

echo ""
echo "=== Résultat ==="
if [ "$HAS_SIGNAL" = true ]; then
  echo -e "Optimisations proposées:\n$RECO"
  echo "Action: recommandations uniquement (aucun changement structurel auto)."
else
  echo "RAS ✅"
fi
