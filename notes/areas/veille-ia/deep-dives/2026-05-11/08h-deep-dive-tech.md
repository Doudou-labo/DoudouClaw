# 🔬 Deep Dive IA - 2026-05-11 - 8h00

**Thème** : État des LLM et Multimodal AI — Mai 2026
**Focus** : TECH
**Généré le** : 11/05/2026 à 08:06 (Paris) | Fallback web_search (Perplexity HS)

---

## 🚨 Perplexity indisponible
Erreur d'authentification API — pattern récurrent. Deep Dive complété via Brave Search + extraction manuelle.

---

## 📊 Panorama des modèles — Mai 2026

### 🥇 Frontière propriétaire — le podium se resserre

| Modèle | Lab | Date | Capacité clé | Prix / Accès |
|--------|-----|------|--------------|--------------|
| GPT-5.5 | OpenAI | 23 avril | -60% hallucinations, 92.4% MMLU, Codex intégré | Rolling out Plus/Pro/Enterprise |
| GPT-5.5 Pro | OpenAI | 23 avril | 39.6% FrontierMath Tier 4 (math/physique dure) | Premium |
| Claude Opus 4.7 | Anthropic | Avril | #1 coding SWE-bench, multi-file engineering, sub-agents | API + Claude Code |
| Claude Opus 4.7 Thinking | Anthropic | Avril | Chain-of-thought + task budgets pour contrôle coût | API |
| Gemini 3.1 Pro | Google | Avril | 94.3% GPQA Diamond, 77.1% ARC-AGI-2, grounding Search | Free tier limité |
| Grok 4.3 | xAI | 30 avril | 1M context, video input, PDF/Excel/PPT natif, 207 tok/s | API + X Premium+ |
| Grok 4.3 | xAI | 30 avril | Input $1.25/$2.50 par 1M tokens (-40%) | API |

**Observation clé** : Les écarts se réduisent. GPT-5.5 est le nouveau "daily driver", Claude Opus 4.7 reste le choix code, Gemini 3.1 Pro gagne sur la fact-checking, Grok 4.3 innove sur la productivité documentaire.

---

### 🔓 Open source — les poids lourds

- **NVIDIA Nemotron 3 Nano Omni** (30B) : multimodal natif (vision+audio+text), top 6 leaderboards, licence permissive.
- **DeepSeek V4 Pro & V4 Flash** : en preview, DeepSeek continue de presser les prix.
- **Qwen 3.6-27B & 35B-A3B** (Alibaba) : sérieux concurrents open-weight.
- **Kimi K2.6** (Moonshot AI) : open source, compétitif sur les benchmarks long-context.
- **Gemma 4** (Google) : open-sourcée Apache 2.0 — Google revient sur le ring open.
- **Llama 4 Maverick/Scout** (Meta) : sortis début avril, mais pas de release cette semaine.

---

### 🆕 Nouveautés fraîches (dernière semaine)

**ERNIE 5.1 — Baidu (8 mai)**
- #4 global LMArena Search Arena
- #1 dans sa classe de paramètres
- Pas un modèle from-scratch : meilleur sous-réseau extrait d'une "super-net" élastique
- 200M utilisateurs actifs mensuels sur l'assistant Baidu
- **Enjeu** : Baidu prouve que l'efficacité paramétrique peut rivaliser avec le brute force.

**SubQ — Subquadratic (5 mai)**
- **12 millions de tokens de context window** — record absolu
- "Subquadratic Sparse Attention" (SSA) : casse le coût quadratique de l'attention classique
- Startup Miami, fondée par ex-Head of GenAI Meta + CEO serial entrepreneur
- $29M en seed funding
- **Enjeu** : Si ça tient ses promesses, ça change la donne pour le RAG et l'analyse de documents massifs.

**Microsoft MAI (fondation models maison)**
- MAI-Transcribe-1, MAI-Voice-1, MAI-Image-2
- Signe que Microsoft réduit sa dépendance à OpenAI pour certains workloads.

---

## 🎯 Tendances structurantes

1. **Multimodal = standard** — plus de modèle "texte seul" en frontière. Vision, audio, texte fusionnés.
2. **Agentic coding** — Claude Code, Codex GPT-5.5, Grok documents. La promesse "vibe coding" devient réalité produit.
3. **Context window inflation** — 1M (Grok), 12M (SubQ). La course au contexte long est relancée.
4. **Prix à la baisse** — Grok -40%, DeepSeek qui presse, Gemini Flash-Lite à $25/M. Inférence bon marché = plus d'agents.
5. **Retrait du vieux monde** — GPT-4o totalement retiré, Sora 2 discontinué (API arrêtée en septembre). OpenAI nettoie son catalogue.

---

## 💡 Points Clés à Retenir

- GPT-5.5 = nouveau défaut quotidien, Claude Opus 4.7 = défaut code, Gemini 3.1 Pro = défaut recherche/fact-check.
- Deux nouveaux acteurs à suivre : SubQ (contexte 12M) et ERNIE 5.1 (efficacité paramétrique).
- xAI et Anthropic poussent fort sur l'agentic/productivité (documents, agents financiers).
- Perplexity API à surveiller — panne récurrente qui perturbe les automations.

---

## 🎯 Actions / Réflexions

- [ ] Vérifier clé API Perplexity + contacter support si pattern persistant
- [ ] Tester GPT-5.5 sur des tâches quotidiennes pour évaluer le gain réel vs GPT-5.4
- [ ] Suivre benchmarks SubQ sur des tâches long-context concrètes (analyse PDF 500+ pages)

---

*Veille automatique — Fallback web_search + extraction manuelle*
