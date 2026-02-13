#!/usr/bin/env python3
import argparse
import json
import sys
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone

USER_AGENT = "Mozilla/5.0 (OpenClaw MarketBrief/1.0)"


def http_get(url: str, timeout: int = 10) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT, "Accept": "*/*"})
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return resp.read()


def safe_float(v):
    try:
        if v in (None, "", "N/D"):
            return None
        return float(v)
    except Exception:
        return None


def fetch_stooq(symbol: str):
    sym = urllib.parse.quote(symbol)
    url = f"https://stooq.com/q/l/?s={sym}&f=sd2t2ohlcvn&h&e=csv"
    raw = http_get(url).decode("utf-8", errors="replace").strip().splitlines()
    if len(raw) < 2:
        return None
    cols = raw[0].split(",")
    vals = raw[1].split(",")
    row = dict(zip(cols, vals))
    close = safe_float(row.get("Close"))
    open_ = safe_float(row.get("Open"))
    if close is None:
        return None
    prev = open_
    pct = None
    if prev and prev != 0:
        pct = (close - prev) / prev * 100.0
    return {
        "symbol": symbol,
        "price": close,
        "prev": prev,
        "pct": pct,
        "source": "Stooq",
        "currency": None,
        "time": f"{row.get('Date','')} {row.get('Time','')}".strip(),
        "name": row.get("Name") or symbol,
    }


def fetch_yahoo(symbol: str):
    sym = urllib.parse.quote(symbol)
    url = f"https://query1.finance.yahoo.com/v8/finance/chart/{sym}?range=5d&interval=1d"
    data = json.loads(http_get(url).decode("utf-8", errors="replace"))
    result = (((data or {}).get("chart") or {}).get("result") or [None])[0]
    if not result:
        return None
    meta = result.get("meta", {})
    price = safe_float(meta.get("regularMarketPrice"))
    prev = safe_float(meta.get("previousClose"))
    if price is None:
        return None
    if prev is None:
        closes = (((result.get("indicators") or {}).get("quote") or [{}])[0]).get("close") or []
        closes = [safe_float(c) for c in closes if safe_float(c) is not None]
        if len(closes) >= 2:
            prev = closes[-2]
        elif len(closes) == 1:
            prev = closes[-1]
    pct = None
    if prev and prev != 0:
        pct = (price - prev) / prev * 100.0
    return {
        "symbol": symbol,
        "price": price,
        "prev": prev,
        "pct": pct,
        "source": "Yahoo API",
        "currency": meta.get("currency"),
        "time": datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC"),
        "name": meta.get("shortName") or symbol,
    }


def get_quote(symbol: str, providers=("stooq", "yahoo")):
    errors = []
    for p in providers:
        try:
            if p == "stooq":
                q = fetch_stooq(symbol)
            elif p == "yahoo":
                q = fetch_yahoo(symbol)
            else:
                q = None
            if q and q.get("price") is not None:
                return q
        except Exception as e:
            errors.append(f"{p}:{e}")
    return {"symbol": symbol, "price": None, "pct": None, "source": " / ".join(providers), "error": "; ".join(errors)[:180]}


def fmt_quote(label: str, q: dict):
    p = q.get("price")
    if p is None:
        return f"- {label}: non disponible ({q.get('source')})"
    pct = q.get("pct")
    pct_s = "n/d" if pct is None else f"{pct:+.2f}%"
    src = q.get("source", "n/d")
    return f"- {label}: {p:,.2f} ({pct_s}) [{src}]".replace(",", " ")


def sort_movers(quotes):
    valid = [q for q in quotes if q.get("pct") is not None]
    valid.sort(key=lambda x: x["pct"])
    losers = valid[:3]
    gainers = list(reversed(valid[-3:]))
    return gainers, losers


def fetch_rss_titles(url: str, limit: int = 2):
    try:
        root = ET.fromstring(http_get(url, timeout=8))
        items = root.findall(".//item")
        out = []
        for it in items[:limit]:
            t = (it.findtext("title") or "").strip()
            if t:
                out.append(t)
        return out
    except Exception:
        return []


def build_brief(region: str, session: str, shares: int):
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    title_map = {
        ("eu", "open"): "🇪🇺 Bourse EU — Ouverture",
        ("eu", "mid"): "🇪🇺 Bourse EU — Mi-séance",
        ("eu", "close"): "🇪🇺 Bourse EU — Clôture",
        ("us", "open"): "🇺🇸 Bourse US — Ouverture",
        ("us", "mid"): "🇺🇸 Bourse US — Mi-séance",
        ("us", "close"): "🇺🇸 Bourse US — Clôture",
    }
    title = title_map.get((region, session), "📈 Point marché")

    lines = [f"{title}", f"⏱️ Snapshot: {now}"]

    if region == "eu":
        indices = [
            ("CAC 40", "^cac", "^FCHI"),
            ("DAX", "^dax", "^GDAXI"),
            ("Euro Stoxx 50", "^stoxx50", "^STOXX50E"),
            ("FTSE 100", "^ukx", "^FTSE"),
        ]
        stocks = [
            ("LVMH", "MC.PA"),
            ("TotalEnergies", "TTE.PA"),
            ("Sanofi", "SAN.PA"),
            ("L'Oréal", "OR.PA"),
            ("Airbus", "AIR.PA"),
            ("ASML", "ASML.AS"),
            ("SAP", "SAP.DE"),
            ("Siemens", "SIE.DE"),
        ]
    else:
        indices = [
            ("S&P 500", "^spx", "^GSPC"),
            ("NASDAQ", "^ndq", "^IXIC"),
            ("Dow Jones", "^dji", "^DJI"),
        ]
        stocks = [
            ("Apple", "AAPL.US"),
            ("Microsoft", "MSFT.US"),
            ("Amazon", "AMZN.US"),
            ("Alphabet", "GOOGL.US"),
            ("Meta", "META.US"),
            ("Nvidia", "NVDA.US"),
            ("Tesla", "TSLA.US"),
            ("Broadcom", "AVGO.US"),
            ("Netflix", "NFLX.US"),
        ]

    lines.append("\n📊 Indices")
    for label, s1, s2 in indices:
        q = get_quote(s1, providers=("stooq", "yahoo"))
        if q.get("price") is None:
            q = get_quote(s2, providers=("yahoo", "stooq"))
        lines.append(fmt_quote(label, q))

    stock_quotes = []
    lines.append("\n🏷️ Valeurs suivies")
    for label, symbol in stocks:
        providers = ("stooq", "yahoo") if symbol.endswith(".US") else ("yahoo", "stooq")
        q = get_quote(symbol, providers=providers)
        q["label"] = label
        stock_quotes.append(q)
        lines.append(fmt_quote(label, q))

    gainers, losers = sort_movers(stock_quotes)
    lines.append("\n🚀 Top hausses (univers suivi)")
    if gainers:
        for q in gainers:
            lines.append(f"- {q.get('label','?')}: {q.get('pct',0):+.2f}%")
    else:
        lines.append("- non disponible")

    lines.append("\n🔻 Top baisses (univers suivi)")
    if losers:
        for q in losers:
            lines.append(f"- {q.get('label','?')}: {q.get('pct',0):+.2f}%")
    else:
        lines.append("- non disponible")

    ml = get_quote("ML.PA", providers=("yahoo", "stooq"))
    lines.append("\n🛞 Michelin (111 actions)")
    if ml.get("price") is None:
        lines.append("- ML.PA: non disponible")
    else:
        value = ml["price"] * shares
        pct_s = "n/d" if ml.get("pct") is None else f"{ml['pct']:+.2f}%"
        lines.append(f"- Cours ML: {ml['price']:.2f} ({pct_s}) [{ml.get('source')}]")
        lines.append(f"- Valeur 111 actions: {value:,.2f}".replace(",", " "))

    news = []
    if region == "eu":
        news += fetch_rss_titles("https://feeds.a.dj.com/rss/RSSMarketsMain.xml", limit=1)
        news += fetch_rss_titles("https://www.cnbc.com/id/20910258/device/rss/rss.html", limit=1)
    else:
        news += fetch_rss_titles("https://www.cnbc.com/id/100003114/device/rss/rss.html", limit=2)

    lines.append("\n🧭 À surveiller")
    if news:
        for t in news[:2]:
            lines.append(f"- {t}")
    else:
        lines.append("- News API/RSS indisponible sur ce run")

    lines.append("\nℹ️ Sources: Stooq CSV, Yahoo Finance API v8, flux RSS (CNBC/DJ).")
    lines.append("ℹ️ Mode anti-blocage activé: fallback automatique + mention 'non disponible' si échec.")
    return "\n".join(lines)


def main():
    ap = argparse.ArgumentParser(description="Generate robust market brief (API-first, anti-bot friendly)")
    ap.add_argument("--region", choices=["eu", "us"], required=True)
    ap.add_argument("--session", choices=["open", "mid", "close"], required=True)
    ap.add_argument("--shares", type=int, default=111)
    args = ap.parse_args()
    print(build_brief(args.region, args.session, args.shares))


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"Erreur génération brief: {e}", file=sys.stderr)
        sys.exit(1)
