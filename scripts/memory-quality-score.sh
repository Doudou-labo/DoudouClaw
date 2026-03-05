#!/usr/bin/env bash
set -euo pipefail

ROOT="/root/.openclaw/workspace"
TODAY="$(TZ=Europe/Paris date +%F)"
FILE="$ROOT/memory/${TODAY}.md"

[[ -f "$FILE" ]] || { echo "No daily file for $TODAY"; exit 0; }

lines=$(wc -l < "$FILE")
sections=$(grep -c '^## ' "$FILE" || true)
open_loops=$(grep -Eic 'prochaine action|next|à faire|todo' "$FILE" || true)
updates_para=$(grep -Eic 'notes/projects|notes/areas|notes/resources|notes/archive|PARA' "$FILE" || true)

score=0
(( lines >= 20 )) && ((score+=25)) || ((score+=10))
(( sections >= 4 )) && ((score+=25)) || ((score+=10))
(( open_loops >= 1 )) && ((score+=25)) || ((score+=5))
(( updates_para >= 1 )) && ((score+=25)) || ((score+=5))

grade="C"
(( score >= 85 )) && grade="A"
(( score >= 70 && score < 85 )) && grade="B"
(( score < 55 )) && grade="D"

cat <<EOF
### 📊 Score qualité mémoire — ${TODAY}
- 🧮 **Score**: ${score}/100 (grade ${grade})
- 🧱 **Structure**: ${sections} sections, ${lines} lignes
- 🗂️ **PARA touchpoints**: ${updates_para}
- ✅ **Open loops détectés**: ${open_loops}
- 🎯 **Action**: $( [[ "$grade" == "A" || "$grade" == "B" ]] && echo "OK, maintenir le rythme." || echo "Renforcer la consolidation quotidienne (N1 + PARA + LTM)." )
EOF
