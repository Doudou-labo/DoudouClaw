# Guide d'utilisation — Actual Budget × DoudouClaw

> Comment parler à DoudouClaw pour interagir avec ton budget.

---

## 🎯 En une phrase

Tu poses tes questions **en français**, DoudouClaw interroge Actual Budget et te répond.

---

## 💬 Exemples de questions que tu peux poser

### 📊 Soldes et aperçus

| Ce que tu veux savoir | Question à poser à DoudouClaw |
|-----------------------|-------------------------------|
| Solde total | "Quel est mon solde total sur tous mes comptes ?" |
| Solde d'un compte | "Quel est mon solde sur mon compte Revolut ?" |
| Solde par compte | "Montre-moi les soldes de tous mes comptes" |
| Aperçu rapide | "État de mes finances en un coup d'œil" |

### 💸 Transactions

| Ce que tu veux savoir | Question à poser à DoudouClaw |
|-----------------------|-------------------------------|
| Dernières dépenses | "Quelles sont mes dernières dépenses ?" |
| Transactions du mois | "Liste mes transactions de mars 2026" |
| Recherche par catégorie | "Combien j'ai dépensé en courses ce mois-ci ?" |
| Recherche par mot-clé | "J'ai dépensé combien chez Amazon ce mois ?" |
| Transaction précise | "Trouve le paiement de 49,99€ du 15 mars" |

### 📅 Budget et catégories

| Ce que tu veux savoir | Question à poser à DoudouClaw |
|-----------------------|-------------------------------|
| Budget par catégorie | "Quel est mon budget restant pour les courses ?" |
| Toutes les catégories | "Montre-moi mes catégories de budget" |
| Dépassement budget | "Est-ce que j'ai dépassé mon budget本月 ?" |
| Comparaison mois | "J'ai dépensé combien en février vs janvier ?" |

### 🏦 Comptes

| Ce que tu veux savoir | Question à poser à DoudouClaw |
|-----------------------|-------------------------------|
| Ajouter un compte | "Ajoute mon compte Livret A à Actual" |
| Lister les comptes | "Liste tous mes comptes" |
| Nouveau compte épargne | "Crée un compte pour mon épargne" |

### 📥 Import et synchronisation

| Ce que tu veux savoir | Question à poser à DoudouClaw |
|-----------------------|-------------------------------|
| Import CSV | "Importe mes transactions depuis le fichier export.csv" |
| Dernier import | "Quand est-ce que j'ai fait mon dernier import ?" |
| Synchroniser | "Synchronise mes comptes bancaires" |

### 🧾 Règles de catégorisation

| Ce que tu veux savoir | Question à poser à DoudouClaw |
|-----------------------|-------------------------------|
| Règles existantes | "Quelles sont mes règles de catégorisation ?" |
| Créer une règle | "Crée une règle pour automatiquement catégoriser..." |
| Règle manquante | "Fais en sorte que tous mes paiements Netflix aillent dans Loisirs" |

---

## 🗣️ Formulation libre

Pas besoin d'être précis. DoudouClaw comprend :

```
"J'ai dépensé quoi ce mois ?"
"Combien il me reste sur mon compte courant ?"
"C'est quoi mes plus grosses dépenses du trimestre ?"
"J'ai reçu mon salaire ce mois ?"
"Montre-moi un résumé de mes finances"
"Combien en moyenne je dépense en courses ?"
```

---

## ⚠️ Notes importantes

- **DoudouClaw ne peut pas effectuer de paiements** — il lit et analyse tes données
- **L'historique** : tu peux lui demander n'importe quelle période (mois, trimestre, année)
- **Le premier import** : tu dois importer tes transactions manuellement dans l'UI d'Actual la première fois, ou via un fichier CSV
- **Bank sync** : si tu configures la synchronisation bancaire (via des services tiers comme Nordigen), DoudouClaw peut aussi déclenche la sync

---

## 🔧 Si ça ne marche pas

| Symptôme | Solution |
|----------|----------|
| DoudouClaw ne comprend pas | Réessaie avec d'autres mots — formulation libre OK |
| "Je n'ai pas accès à Actual" | Vérifie les variables d'env dans le skill |
| Données incomplètes | Lance un import depuis l'UI d'Actual |
| Erreur de connexion | `bash notes/projects/actual-budget-integration/scripts/test-actual-connection.sh` |

---

## 📍 Accès direct à l'UI

Si tu préfères ouvrir toi-même :

👉 **https://actual.doudougen.xyz**

(Mot de passe demandé par Caddy : tes identifiants DoudouClaw)
