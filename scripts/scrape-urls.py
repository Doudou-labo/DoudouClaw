#!/usr/bin/env python3
"""
scrape-urls.py — Scrape le contenu d'une liste d'URLs avec Scrapling
Usage: cat urls.txt | python3 scrape-urls.py
       ou: echo "https://example.com" | python3 scrape-urls.py

Sortie: JSON avec titre, meta description, contenu principal, URL
"""

import json
import sys
from urllib.parse import urlparse

try:
    from scrapling.fetchers import Fetcher, StealthyFetcher
except ImportError:
    print(json.dumps({"error": "Scrapling non installé. pip install scrapling"}), file=sys.stderr)
    sys.exit(1)

def scrape_url(url):
    """Scrape une URL et retourne les infos clés"""
    try:
        # Utiliser StealthyFetcher pour les sites protégés
        page = StealthyFetcher.fetch(url, headless=True, timeout=30)
        
        # Extraire les métadonnées
        title = page.css('title').first
        title_text = title.text if title else ""
        
        meta_desc = page.css('meta[name="description"]').first
        description = meta_desc.attr('content') if meta_desc else ""
        
        # Extraire le contenu principal (h1, h2, p principaux)
        h1 = page.css('h1').first
        h1_text = h1.text if h1 else ""
        
        # Premier paragraphe significatif
        paragraphs = page.css('p')
        content = ""
        for p in paragraphs[:5]:  # Les 5 premiers paragraphes
            text = p.text.strip() if p.text else ""
            if len(text) > 100:  # Ignorer les paragraphes trop courts
                content = text[:800]  # Limiter à 800 caractères
                break
        
        # Détecter si c'est un paywall (contenu très court)
        is_paywall = len(content) < 200 and "abonn" in (content + description).lower()
        
        return {
            "url": url,
            "domain": urlparse(url).netloc,
            "title": title_text[:200],
            "description": description[:300],
            "h1": h1_text[:200],
            "content": content,
            "is_paywall": is_paywall,
            "success": True
        }
    except Exception as e:
        return {
            "url": url,
            "error": str(e),
            "success": False
        }

def main():
    urls = []
    
    # Lire les URLs depuis stdin
    for line in sys.stdin:
        url = line.strip()
        if url and url.startswith('http'):
            urls.append(url)
    
    if not urls:
        print(json.dumps({"error": "Aucune URL valide fournie"}), file=sys.stderr)
        sys.exit(1)
    
    results = []
    for url in urls[:5]:  # Limiter à 5 URLs pour éviter de surcharger
        result = scrape_url(url)
        results.append(result)
    
    # Sortie JSON
    print(json.dumps(results, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    main()
