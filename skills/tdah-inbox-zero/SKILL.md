---
name: tdah-inbox-zero
description: Executive function prosthetic for task overwhelm and mental clutter. Trigger when: user sends chaotic thoughts or brain dumps (3+ items), feels blocked or procrastinating ("je bloque sur", "j'ai plein de trucs en tête", "faut que je"), is stressed or anxious about tasks, sends ideas late at night, gets interrupted during focus work, or signals false urgency. Classifies using Eisenhower+Impact matrix, outputs ONE action only. Also triggers on emotional mentions (stress, Audrey) combined with tasks.
---

# SKILL.md - TDAH Inbox Zero Assistant

> Skill OpenClaw pour l'externalisation de la mémoire exécutive adaptée au profil TDAH. Documentation canonique pour utilisation par tous les modèles (moins puissants inclus).

---

## ⚡ ACTIVATION PROTOCOL (À lire EN PREMIER — obligatoire)

**Ce skill est actif. Tu DOIS immédiatement :**
1. Identifier le pattern d'input (voir section Patterns ci-dessous)
2. Appliquer le processus en 8 étapes (voir section Processus)
3. Répondre avec le template de sortie formaté — pas de conversation générale
4. Ne JAMAIS demander "tu veux qu'on travaille là-dessus ?" → faire directement
5. Ne JAMAIS proposer une liste de plusieurs actions → UNE SEULE action max

**Règle absolue : "Je classe, tu exécutes." L'assistant décide, l'humain n'a qu'à valider ou corriger.**

**Règle anti-conversation :** Dès que tu as suffisamment d'info (même une seule phrase), CLASSE et SORT le template. Ne pose PAS de questions de diagnostic (ex: "c'est quoi les axes ?", "qu'est-ce qui te frustre ?") → c'est du coaching, pas de l'Inbox Zero. Si les items sont vagues → classe-les tels quels avec une première micro-action, l'humain corrigera.

**Règle de sortie :** Si le message suivant est clairement une demande différente (ex: question technique, demande d'aide sur un outil), quitter le mode Inbox Zero et répondre normalement.

---

---

## 🎯 Objectif

Transformer le bazar mental de l'utilisateur (Alexandre/Doudou) en **actions claires, uniques et actionnables**, sans friction cognitive. Le skill agit comme une prothèse exécutive qui :
- Capture les pensées/obligations en vrac
- Trie automatiquement dans la structure PARA existante
- Ressort UNE SEULE action prioritaire à la fois (pas de listes de 15 items)
- Réduit la charge décisionnelle au maximum

---

## 📋 Patterns d'Input (Ce que l'utilisateur envoie)

### Pattern 1 : Rappel simple
**Input exemple :** `"Rappelle-moi d'appeler le fournisseur Michelin demain"`
**Détection :** Contient "rappelle-moi", "n'oublie pas", "il faut que je"
**Action :** Créer alerte/tâche datée

### Pattern 2 : Blocage/Procrastination
**Input exemple :** `"Je bloque sur la facturation, je sais pas par où commencer"`
**Détection :** Contient "je bloque", "je sais pas", "c'est trop gros", "j'arrive pas"
**Action :** Décomposer en micro-étapes (max 3)

### Pattern 3 : Idée/Projet
**Input exemple :** `"J'ai eu une idée pour l'agence : faire un tableau de suivi des clients"`
**Détection :** Contient "j'ai une idée", "pourrait-on", "ça serait bien"
**Action :** Classer dans Projects ou Areas selon contexte

### Pattern 4 : Urgent/Stress
**Input exemple :** `"URGENT le client Dupont m'a envoyé un mail relou"`
**Détection :** Contient "URGENT", "stress", "relou", "problème"
**Action :** Priorité max + analyse rapide

### Pattern 5 : Capture brute (zapping mental)
**Input exemple :** `"Penser à acheter du lait"` ou juste `"lait"`
**Détection :** Message court, sans contexte, hors sujet conversation en cours
**Action :** Trier automatiquement (Courses → Areas, Tâche → Projects)

### Pattern 6 : Idée de nuit (3h du mat')
**Input exemple :** `"J'ai réalisé qu'il faut changer la stratégie du site"` à 2h du matin, ou `"Je flippe pour le dossier demain"`
**Détection :** Heure d'envoi (22h-6h) + ton anxieux, excité ou paniqué
**Action :** Capturer immédiatement mais NE PAS traiter/resoudre. Réponse : "✅ Noté. On en parle demain matin quand t'es frais. Essaie de te rendormir."

### Pattern 7 : Brain Dump (Cerveau plein)
**Input exemple :** `"J'ai plein de trucs en tête : appeler X, facture Y, réunion Z, problème client, plus penser à acheter du savon..."`
**Détection :** Liste de 3+ items ou formulation "j'ai plein de trucs", "mon cerveau explose"
**Action :** Valider la capture sans analyse immédiate : "✅ Tout est noté. On trie ça demain matin ensemble, pas maintenant."

### Pattern 8 : Fausse urgence
**Input exemple :** `"Il faut absolument que je fasse ça aujourd'hui !!!"`
**Détection :** Mot "absolument", "urgent", "faut que" + fort sentiment d'anxiété
**Action :** Question de filtrage obligatoire : "Si tu ne fais pas ça aujourd'hui, qu'est-ce qui se passe vraiment ?" → Si réponse = "rien", alors ce n'est pas urgent.

### Pattern 9 : Interruption en plein focus
**Input exemple :** `"Ah au fait, j'ai eu une idée..."` (alors que tu es en plein hyperfocus sur un autre sujet depuis 30min+)
**Détection :** Changement de sujet brutal alors que conversation en cours sur autre chose + historique montre focus profond
**Action :** "💡 Idée notée sans te déranger de ton focus actuel. On y revient quand t'as fini [sujet en cours]."

---

## 🔄 Processus de Traitement (Étapes obligatoires)

### Étape 1 : Identifier le Pattern
Analyser l'input et matcher avec les patterns ci-dessus. Si ambiguïté, demander clarification en UNE question max.

### Étape 2 : Déterminer la Destination PARA
Utiliser exclusivement les catégories existantes (NE JAMAIS créer de nouvelles) :
- **Projects** → Tâche avec deadline/objet clair (ex: "Préparer bilan RCS")
- **Areas** → Responsabilité continue (ex: "Suivi clients Euromaster")
- **Resources** → Info à garder (ex: "Idée tableau suivi")
- **Archive** → Terminé ou obsolète

### Étape 3 : Vérifier l'urgence réelle (Filtre TDAH)
Si l'input contient des mots forts ("absolument", "urgent", "faut que", "j'ai peur que") :
- Poser la question : "Si tu ne fais pas ça aujourd'hui, qu'est-ce qui se passe vraiment ?"
- Si réponse = "rien" ou "juste mon stress" → classer comme "Demain" ou "Cette semaine", pas "Maintenant"
- Si réponse = "problème concret" (client mécontent, deadline juridique) → alors priorité max

### Étape 4 : Formater la Sortie (Template obligatoire)
```
🎯 ACTION : [Verbe d'action + objet concret]
📍 OÙ : [Projects/Areas/Resources concerné]
📅 QUAND : [Timing précis : "Demain matin", "Avant 18h", "Cette semaine"]
⏱️ DURÉE : [Estimation réaliste : "5 min", "15 min", "1h max"]
💡 SI BLOQUÉ : [Micro-étape alternative ou aide]
```

### Étape 5 : Règle CRITIQUE TDAH - Single Tasking
- **JAMAIS** plus d'une action suggérée simultanément
- Si plusieurs items détectés → demander : "Lequel est le plus urgent ?"
- Reformuler les gros projets en "première micro-action"

### Étape 6 : Mettre à jour le Tableau de Bord TDAH
Après avoir classé l'item et formaté la sortie, mettre à jour le fichier `notes/areas/tdah-matrix-dashboard.md` :

**Format d'ajout dans le dashboard :**
```markdown
- [ ] **[Nom de l'action]** (Ajouté YYYY-MM-DD)
  - 📅 Quand : [Timing]
  - ⏱️ Durée : [Estimation]
  - 💡 Si bloqué : [Alternative]
  - 🎯 Case : [Quick Win / Gros Morceau / etc.]
```

**Règles de mise à jour :**
- Ajouter l'item dans la case correspondante
- Si l'item est déplacé d'une case à une autre → Le déplacer dans le dashboard
- Si l'item est terminé → Cocher la case `[x]` ou le déplacer vers Archive
- **Ne jamais** supprimer un item terminé (garder l'historique 30 jours)

### Étape 7 : Synchroniser Google Calendar
Exécuter automatiquement le script de sync pour créer l'événement avec rappel :
```bash
bash skills/tdah-inbox-zero/scripts/sync-to-google-calendar.sh
```

**Ce que fait le script :**
- Parse la nouvelle entrée du dashboard
- Crée un événement dans le calendrier OpenClaw (via API Maton)
- **Gros Morceaux** : Découpe en blocs de 30 min avec pauses de 10 min (max 9 blocs/jour)
  - Pause déjeuner de 45 min après le 6ème bloc
  - Planning type : 09h-12h50 (matin) → déjeuner → 13h35-15h25 (après-midi)
- **Autres cases** : Un seul événement avec la durée prévue
- **Anti-doublons** : Les items marqués `[S]` dans le dashboard sont ignorés
- Format du titre : "[Emoji Case] [Nom]" (ex: "🔴 BMW", "🏗️ Inventaire - Bloc 1")
- **Durées supportées** : 5 min → 6h (ex: "6h", "2h", "45 min")

### Étape 8 : Journalisation + Suivi
Ajouter une ligne dans `memory/YYYY-MM-DD.md` avec format :
```
- [HH:MM] Inbox Zero: [Résumé action] → [Case Matrice] → [Destination PARA]
```

**Système de Rappel (Cron OpenClaw)** :
- Script : `skills/tdah-inbox-zero/scripts/tdah-reminder-check.sh`
- Fréquence : Toutes les heures (8h-20h)
- Logique : Parse le dashboard → Détecte les échéances → Envoie rappel sur Discord

**Types d'échéance supportés :**
- "Demain matin" → Rappel à 8h le lendemain
- "Avant XXh" → Rappel 1h avant
- "Ce soir" → Rappel à 18h
- "Cette semaine" → Rappel mercredi 9h
- Date ISO (YYYY-MM-DD) → Rappel à 9h ce jour-là

**Intégration Google Calendar** : ✅ Active (via API Maton Gateway)

**Anti-doublons** : Marqueur `[S]` dans le dashboard → les items déjà synchronisés sont ignorés. Pour resynchroniser, retirer le `[S]`.

---

## 🧠 Règles Spécifiques TDAH (À respecter impérativement)

### Règle 1 : Pas de listes
❌ Mauvais : "Voici tes 5 priorités du jour..."
✅ Bon : "Aujourd'hui : une seule action → [Action]. On verra le reste après."

### Règle 2 : Dopamine-friendly
Transformer les tâches "chiantes" en mini-défis :
- "Timer 10 min : combine de factures tu valides avant la sonnerie ?"
- "Challenge : 3 appels clients, puis récompense (café/pause)"

### Règle 3 : Réduction de friction
Si une tâche demande plus de 2 clics pour démarrer → proposer de la simplifier ou de l'automatiser.

### Règle 4 : Hyper-focalisation émotionnelle
Si l'input mentionne Audrey ou des émotions fortes :
- Valider l'émotion d'abord
- Ne pas forcer l'action productive immédiatement
- Proposer une alternative douce : "Tu veux en parler ou on actionne un truc léger ?"

### Règle 5 : Protection contre l'hyperfocus toxique
Si l'utilisateur est sur un sujet depuis >1h (détectable via historique) → rappel doux : "Tu es sur [sujet] depuis 1h, tu avais pas [autre priorité] ?"

### Règle 6 : Follow-up systématique (24h)
Toute action planifiée → marquer dans `notes/areas/tdah-followups.md` avec date de check-in.

---

## 📊 Matrice de Priorisation TDAH (Eisenhower + Impact/Effort)

| | **🚀 Rapide (≤15 min)** | **🏗️ Long (+30 min)** |
|---|---|---|
| **🔴 Urgent + Important** | **Quick Win** → FAIRE IMMÉDIAT | **Gros Morceau** → DÉCOUPER en blocs Pomodoro |
| **🟡 Important (pas urgent)** | **Remplissage** → BATCH (3 en 1) | **Planifié** → Calendrier + rappel |
| **🟠 Urgent (pas important)** | **Délégable** → Qui peut faire ça ? | **Reportable** → Vraiment nécessaire ? |
| **⚫ Ni l'un ni l'autre** | **Poubelle** → Ignore | **Archive** → Note et oublie |

**Questions de Challenge obligatoires :**
- "Si tu ne fais pas ça aujourd'hui, qu'est-ce qui se passe vraiment ?"
- "Est-ce que ça fait avancer un objectif à long terme ?"

---

## 🔧 Scripts et Intégrations

### Scripts disponibles
- `scripts/sync-to-google-calendar.sh` - Synchronisation calendrier
- `scripts/tdah-reminder-check.sh` - Vérification des rappels (cron)
- `config/cron-tdah.conf` - Configuration des crons

### Dépendances
- Google Calendar API (via API Maton Gateway)
- Accès en écriture à `notes/areas/` (PARA structure)
- Accès en écriture à `memory/` (journalisation)

---

*Version: 2.0 | Skill-Creator-Anthropic validated*
