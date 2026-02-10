# Ops / Sécurité — zone de vie

## Contexte
- Beaucoup de tentatives SSH nocturnes observées.
- Souhait: installer **fail2ban**.

## Contraintes / avant d’agir
Avant activation fail2ban:
- confirmer le mode d’accès (SSH direct, VPN, bastion?)
- lister IPs légitimes à whitelister
- décider si l’accès root doit être autorisé ou non

## TODO (à convertir en actions)
- Préparer plan fail2ban (jail sshd) + whitelist + test de non-verrouillage.
- Lancer installation/config uniquement après feu vert explicite.
