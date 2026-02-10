#!/usr/bin/env bash
set -euo pipefail

PUB_FILE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/docs/age-public-key.txt"
DATA_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/data"

if [[ ! -f "$PUB_FILE" ]]; then
  echo "ERROR: missing public key file: $PUB_FILE" >&2
  exit 1
fi

PUB=$(cat "$PUB_FILE")

shopt -s nullglob
files=("$DATA_DIR"/*.json)

if (( ${#files[@]} == 0 )); then
  echo "No plaintext .json files found in $DATA_DIR" >&2
  exit 0
fi

for f in "${files[@]}"; do
  out="$f.age"
  echo "Encrypting $(basename "$f") -> $(basename "$out")"
  age -r "$PUB" -o "$out" "$f"
  # remove plaintext after successful encryption
  rm -f "$f"
done

echo "Done. Plaintext removed."