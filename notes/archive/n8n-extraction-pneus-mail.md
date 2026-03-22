# 📧 Projet n8n : Extraction automatique des commandes pneus

> Use case : Forward mail entreprise → Gmail perso → n8n → Extraction pneus → Action

## Contexte
- **Problème** : Mails de confirmation RDV en ligne contiennent des références pneus à commander, mais passent souvent à côté
- **Contrainte** : Gmail entreprise non connectable (sécurité IT)
- **Solution** : Boîte Gmail intermédiaire + n8n self-hosted

## Architecture

```
[Mail entreprise]
       ↓
   [Forward manuel]
       ↓
[Gmail perso doudou.pneus@gmail.com]
       ↓
   [n8n - Trigger IMAP/Gmail]
       ↓
   [Extraction regex/code]
       ↓
[Sortie : Discord / Google Sheets / pneu-tracker]
```

## Étapes d'implémentation

### 1. Préparation Gmail
- [ ] Créer `doudou.pneus@gmail.com`
- [ ] Activer IMAP : Paramètres → Transfert et POP/IMAP → IMAP = Oui
- [ ] Créer une règle de filtre si besoin

### 2. Workflow n8n
- [ ] Trigger : **IMAP Email** (plus stable que Gmail API)
  - Serveur : `imap.gmail.com:993`
  - User : `doudou.pneus@gmail.com`
  - Password : App Password (pas le mot de passe normal !)
  
- [ ] Node **Code** pour extraction :
  ```javascript
  const emailBody = $input.first().json.text;
  // Regex pour trouver les références pneus (SAP ou autres)
  const pneuRegex = /(\d{6,})/g; // ou pattern spécifique
  const pneus = emailBody.match(pneuRegex);
  return [{ json: { pneus: pneus || [], date: new Date().toISOString() }}];
  ```

- [ ] Node **Discord** ou **Google Sheets** ou **HTTP Request vers pneu-tracker**

### 3. Test
- [ ] Envoyer un mail test avec références pneus
- [ ] Vérifier l'extraction
- [ ] Valider la sortie

## Notes
- Format des mails à analyser : "Confirmation de rendez-vous en ligne"
- Références à extraire : codes SAP des pneus (6+ chiffres généralement)
- Action finale souhaitée : Liste de tâches / Commande à passer

## Créé
- Date : 2026-03-15
- Par : Doudou
- Statut : En attente (à implémenter demain)
