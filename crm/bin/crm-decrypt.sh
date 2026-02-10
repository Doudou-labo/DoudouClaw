#!/usr/bin/env bash
set -euo pipefail

KEY_FILE="/root/.config/crm-age.key"
DATA_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/data"

if [[ ! -f "$KEY_FILE" ]]; then
  echo "ERROR: missing key file: $KEY_FILE" >&2
  exit 1
fi

shopt -s nullglob
files=("$DATA_DIR"/*.json.age)

if (( ${#files[@]} == 0 )); then
  echo "No .json.age files found in $DATA_DIR" >&2
  exit 0
fi

for f in "${files[@]}"; do
  out="${f%.age}"
  echo "Decrypting $(basename "$f") -> $(basename "$out")"
  age -d -i "$KEY_FILE" -o "$out" "$f"
done

echo "Done. NOTE: plaintext JSON now exists in $DATA_DIR. Re-encrypt ASAP (./crm/bin/crm-encrypt.sh)."