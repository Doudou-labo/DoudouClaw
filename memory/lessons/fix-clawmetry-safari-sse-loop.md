---
title: "Fix ClawMetry Safari SSE loop"
date: 2026-03-19
type: lesson
---

# Lesson: Fix ClawMetry Safari SSE loop

## What Happened
[The situation or event]

## What I Learned
[The insight or takeaway]

## How to Apply
[How to use this knowledge going forward]

#lesson

## Details
Les EventSource de ClawMetry (streams SSE) se lancent auto au chargement de la page dashboard.py. Sur Safari/iPhone derrière Caddy, ça crée des timeouts et une boucle Load failed. Fix : fonction shouldDisableLiveStreams() qui détecte iPhone/Safari et désactive les streams. Dashboard остаётся fonctionnel, juste moins live sur mobile. Appliqué 2026-03-19 dans le submodule skills/clawmetry-dashboard/.
