# Mise à jour horaires cron Memory-PARA

**Date:** 2026-03-14
**Motif:** Ajustement pour fuseau horaire Paris (UTC+1 heure d'hiver)

## Changement

Les crons étaient configurés en UTC brut, ce qui causait un décalage d'1h avec l'heure de Paris.

### Avant (UTC)
- 09:00 UTC = 10:00 Paris ❌
- 13:00 UTC = 14:00 Paris ❌
- 18:30 UTC = 19:30 Paris ❌
- 22:30 UTC = 23:30 Paris ❌

### Après (ajusté UTC+1)
- 08:00 UTC = 09:00 Paris ✅
- 12:00 UTC = 13:00 Paris ✅
- 17:30 UTC = 18:30 Paris ✅
- 21:30 UTC = 22:30 Paris ✅

## Note
À ajuster manuellement au passage à l'heure d'été (dernier dimanche de mars) :
- En été UTC+2, les crons UTC resteront mais afficheront +2h
- À prévoir: créneau décalé de 1h ou ajustement des crons
