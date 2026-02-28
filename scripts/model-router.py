#!/usr/bin/env python3
import argparse
import json
import sys
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

MODEL_MAP = {
    "discussion": "anthropic/claude-haiku-4-5",
    "economy": "openai-codex/gpt-5.1-codex-mini",
    "analysis": "anthropic/claude-sonnet-4-6",
    "code": "anthropic/claude-sonnet-4-6",
}

ECONOMY_THRESHOLD = 80


def classify(text: str) -> List[str]:
    normalized = text.lower()
    hits = []
    for keyword, category in CONTEXT_KEYWORDS.items():
        if keyword in normalized:
            hits.append(category)
    return hits


def choose_model(text: str) -> dict:
    proposal = {
        "model": MODEL_MAP["discussion"],
        "reason": "Défaut discussion légère",
        "category": "discussion",
    }
    if len(text.strip()) == 0:
        return proposal
    hints = classify(text)
    if "analysis" in hints or "code" in hints:
        proposal["model"] = MODEL_MAP["analysis"]
        proposal["reason"] = "Mots clés d’analyse/code détectés: {}".format(
            ", ".join(sorted(set(hints)))
        )
        proposal["category"] = "analysis"
    elif any(keyword in text.lower() for keyword in ["répond", "question", "idée", "brainstorm"]):
        proposal["model"] = MODEL_MAP["economy"]
        proposal["reason"] = "Requête rédaction légère / brainstorming"
        proposal["category"] = "economy"
    elif len(text) > ECONOMY_THRESHOLD and not hints:
        proposal["model"] = MODEL_MAP["economy"]
        proposal["reason"] = "Longue question sans mots clés techniques"
        proposal["category"] = "economy"
    return proposal


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
