#!/usr/bin/env python3
import argparse
import json
from typing import List

CONTEXT_KEYWORDS = {
    "code": "code",
    "script": "code",
    "debug": "code",
    "log": "analysis",
    "analysis": "analysis",
    "error": "analysis",
    "architecture": "analysis",
    "api": "analysis",
    "database": "analysis",
    "ci": "analysis",
    "pipeline": "analysis",
    "security": "analysis",
    "test": "analysis",
    "bug": "analysis",
    "refactor": "analysis",
    "deploy": "analysis",
    "planning": "analysis",
    "strategy": "analysis",
    "roadmap": "analysis",
    "design": "analysis",
    "performance": "analysis",
    "optimization": "analysis",
    "task": "discussion",
    "rappel": "discussion",
    "idée": "discussion",
    "brainstorm": "discussion",
    "question": "discussion",
}

PRIORITY_MODELS = {
    "discussion": [
        "anthropic/claude-haiku-4-5",
        "kimi-coding/k2p5",
        "openai-codex/gpt-5.1-codex-mini",
    ],
    "analysis": [
        "openai-codex/gpt-5.3-codex",
        "anthropic/claude-sonnet-4-6",
        "kimi-coding/k2p5",
    ],
}

LONG_FORM_THRESHOLD = 80


def classify(text: str) -> List[str]:
    normalized = text.lower()
    hits = []
    for keyword, category in CONTEXT_KEYWORDS.items():
        if keyword in normalized:
            hits.append(category)
    return hits


def choose_model(text: str) -> dict:
    category = "discussion"
    reason = "Ordre recommandé Haiku → K2P5 → Codex-mini"
    if len(text.strip()) == 0:
        return {
            "model": PRIORITY_MODELS[category][0],
            "reason": reason,
            "category": category,
            "order": PRIORITY_MODELS[category],
        }

    hints = classify(text)
    normalized = text.lower()

    if "analysis" in hints or "code" in hints:
        category = "analysis"
        reason = "Mots clés techniques détectés ({}).".format(
            ", ".join(sorted(set(hints)))
        )
    elif any(keyword in normalized for keyword in ["répond", "question", "idée", "brainstorm"]):
        reason = "Requête rédaction légère / brainstorming (ordre Haiku → K2P5 → Codex-mini)."
    elif len(text) > LONG_FORM_THRESHOLD and not hints:
        reason = "Longue question sans mots clés techniques (ordre Haiku → K2P5 → Codex-mini)."

    return {
        "model": PRIORITY_MODELS[category][0],
        "reason": reason,
        "category": category,
        "order": PRIORITY_MODELS[category],
    }


def main():
    parser = argparse.ArgumentParser(
        description="Détermine le modèle recommandé pour la discussion en cours"
    )
    parser.add_argument("-t", "--text", help="Texte à analyser", required=True)
    parser.add_argument(
        "--json", action="store_true", help="Sortie JSON pour automation"
    )
    args = parser.parse_args()
    result = choose_model(args.text)
    if args.json:
        print(json.dumps(result, ensure_ascii=False))
    else:
        print(f"Modèle recommandé : {result['model']} ({result['reason']})")


if __name__ == "__main__":
    main()
