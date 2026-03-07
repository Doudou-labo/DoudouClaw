"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const CART_KEY = "venus_beaute_cart";

function readCartCount() {
  if (typeof window === "undefined") return 0;

  const raw = localStorage.getItem(CART_KEY);
  if (!raw) return 0;

  try {
    const items = JSON.parse(raw) as Array<{ quantity?: number }>;
    if (!Array.isArray(items)) return 0;
    return items.reduce((sum, item) => sum + Math.max(0, Number(item.quantity || 0)), 0);
  } catch {
    return 0;
  }
}

export default function CartBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const refresh = () => setCount(readCartCount());

    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener("venus_cart_updated", refresh as EventListener);

    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("venus_cart_updated", refresh as EventListener);
    };
  }, []);

  return (
    <Link href="/checkout" className="relative rounded-xl border border-green-300 px-4 py-2 hover:bg-green-100">
      Panier
      <span className="absolute -right-2 -top-2 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-green-700 px-1 text-xs font-bold text-white">
        {count}
      </span>
    </Link>
  );
}
