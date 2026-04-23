import { useEffect, useState, useCallback } from "react";
import type { DbMenuItem } from "@/types/database";

export interface CartLine {
  id: string;
  date: string; // ISO date '2026-04-28'
  qty: number;
}

const KEY = "sekotal-cart";

const read = (): CartLine[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as CartLine[]) : [];
  } catch {
    return [];
  }
};

const write = (lines: CartLine[]) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(lines));
  window.dispatchEvent(new Event("sekotal-cart-change"));
};

export function useCart() {
  const [lines, setLines] = useState<CartLine[]>([]);

  useEffect(() => {
    setLines(read());
    const onChange = () => setLines(read());
    window.addEventListener("sekotal-cart-change", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("sekotal-cart-change", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const add = useCallback((id: string, date: string, qty = 1) => {
    const current = read();
    const found = current.find((l) => l.id === id && l.date === date);
    let next: CartLine[];
    if (found) {
      next = current.map((l) =>
        l.id === id && l.date === date ? { ...l, qty: l.qty + qty } : l,
      );
    } else {
      next = [...current, { id, date, qty }];
    }
    write(next);
  }, []);

  const setQty = useCallback((id: string, date: string, qty: number) => {
    const current = read();
    const next =
      qty <= 0
        ? current.filter((l) => !(l.id === id && l.date === date))
        : current.map((l) =>
            l.id === id && l.date === date ? { ...l, qty } : l,
          );
    write(next);
  }, []);

  const remove = useCallback((id: string, date: string) => {
    write(read().filter((l) => !(l.id === id && l.date === date)));
  }, []);

  const clear = useCallback(() => write([]), []);

  const totalItems = lines.reduce((s, l) => s + l.qty, 0);
  const groupByDate = () => {
    const groups = new Map<string, CartLine[]>();
    lines.forEach((line) => {
      if (!groups.has(line.date)) groups.set(line.date, []);
      groups.get(line.date)!.push(line);
    });
    return groups;
  };

  return { lines, add, setQty, remove, clear, totalItems, groupByDate };
}

export function useCartWithItems(menuItems: DbMenuItem[]) {
  const { lines, totalItems, groupByDate } = useCart();

  const items = lines
    .filter((l) => l.date) // Filter out items without date (backward compatibility)
    .map((l) => {
      const m = menuItems.find((x) => x.id === l.id);
      return m ? { ...l, item: m } : null;
    })
    .filter((x): x is CartLine & { item: DbMenuItem } => !!x);

  const totalPrice = items.reduce((s, l) => s + l.qty * l.item.price, 0);
  const itemsByDate = () => {
    const groups = groupByDate();
    const result = new Map<string, (CartLine & { item: DbMenuItem })[]>();
    groups.forEach((lines, date) => {
      if (!date) return; // Skip items without date
      const dateItems = lines
        .filter((l) => l.date) // Ensure date exists
        .map((l) => {
          const m = menuItems.find((x) => x.id === l.id);
          return m ? { ...l, item: m } : null;
        })
        .filter((x): x is CartLine & { item: DbMenuItem } => !!x);
      if (dateItems.length > 0) {
        result.set(date, dateItems);
      }
    });
    return result;
  };

  return { lines, items, totalItems, totalPrice, groupByDate, itemsByDate };
}
