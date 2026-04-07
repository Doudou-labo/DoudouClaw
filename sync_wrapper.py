#!/usr/bin/env python3
import subprocess
import sys
import os

# Chemin vers notre workspace
workspace = "/root/.openclaw/workspace"
script_path = os.path.join(workspace, "scripts/crm-notion-bidirectional-sync.py")

# Lancer le script
result = subprocess.run([sys.executable, script_path, "--apply"], cwd=workspace)
sys.exit(result.returncode)