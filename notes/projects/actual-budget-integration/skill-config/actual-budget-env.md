# ============================================================
# Configuration des variables d'environnement
# Skill : thisisjeron/actual-budget (ClawHub)
# ============================================================
#
# Ces variables sont nécessaires pour que le skill OpenClaw
# puisse communiquer avec Actual Budget via @actual-app/api.
#
# Elles doivent être configurées dans :
#   - Le fichier .env local (pour les scripts manuels)
#   - La config du gateway OpenClaw (pour DoudouClaw en production)
# ============================================================

# ------------------------------------------------------------
# 1. ACTUAL_SERVER_URL
# ------------------------------------------------------------
# URL du serveur Actual Budget
#
# ⚠️  IMPORTANT : deux valeurs selon le contexte :
#
#   - Scripts locaux / tests : http://localhost:5006
#   - Skill OpenClaw (depuis le gateway) : http://actual:5006
#     (résolution Docker network, pas localhost)
#
# Valeur recommandée pour le skill OpenClaw :
ACTUAL_SERVER_URL=http://actual:5006

# ------------------------------------------------------------
# 2. ACTUAL_PASSWORD
# ------------------------------------------------------------
# Mot de passe du budget Actual Budget
# (celui que tu as défini lors de la création du budget)
#
# ⚠️  Ne JAMAIS commiter cette valeur
# Stocké dans :
#   - /root/.openclaw/workspace/notes/projects/actual-budget-integration/.env
#   - Config gateway OpenClaw (via gateway config.patch)
#
# Exemple :
# ACTUAL_PASSWORD=MonSuperMotDePasse123!

# ------------------------------------------------------------
# 3. ACTUAL_SYNC_ID
# ------------------------------------------------------------
# Identifiant unique du budget ( Sync ID )
# Troubleshoot: Si "budget not found", c'est que ce champ est vide ou erroné.
#
# Comment le trouver :
#   1. Ouvre https://budget.doudougen.xyz
#   2. Va dans Settings (⚙️) du budget
#   3. Cherche "Sync ID" ou "ID de synchronisation"
#   4. Copie la valeur (format UUID, ex: a1b2c3d4-...)
#
# ⚠️  Tu DOIS créer le budget dans l'UI AVANT de récupérer le SYNC_ID
#
# Exemple :
# ACTUAL_SYNC_ID=a1b2c3d4-e5f6-7890-abcd-ef1234567890

# ------------------------------------------------------------
# Comment configurer dans OpenClaw
# ------------------------------------------------------------

# Option A : via gateway config.patch (recommandé)
# -----------------------------------------------
# Ouvre le fichier de config du gateway (openclaw.json ou via CLI)
# et ajoute dans la section "env" ou "skills" :

# {
#   "skills": {
#     "actual-budget": {
#       "env": {
#         "ACTUAL_SERVER_URL": "http://actual:5006",
#         "ACTUAL_PASSWORD": "TON_MOT_DE_PASSE",
#         "ACTUAL_SYNC_ID": "TON_SYNC_ID"
#       }
#     }
#   }
# }

# Option B : via la config globale du gateway
# -----------------------------------------------
# Si le skill ne supporte pas de config par skill, ajoute dans
# la section "env" globale du gateway OpenClaw :

# {
#   "env": {
#     "ACTUAL_SERVER_URL": "http://actual:5006",
#     "ACTUAL_PASSWORD": "TON_MOT_DE_PASSE",
#     "ACTUAL_SYNC_ID": "TON_SYNC_ID"
#   }
# }

# ------------------------------------------------------------
# Commandes de validation
# ------------------------------------------------------------

# Vérifier que le serveur est joignable :
#   curl http://localhost:5006

# Tester la connexion API complète :
#   bash notes/projects/actual-budget-integration/scripts/test-actual-connection.sh

# Redémarrer le gateway après modification :
#   openclaw gateway restart

# Vérifier le statut du skill :
#   clawhub list
#   openclaw skills list
