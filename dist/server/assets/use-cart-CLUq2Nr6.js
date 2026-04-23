import { c as createLucideIcon } from "./utils-D47OA262.js";
import { r as reactExports } from "./worker-entry-BvBN2c8W.js";
const __iconNode = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
];
const Plus = createLucideIcon("plus", __iconNode);
const KEY = "sekotal-cart";
const read = () => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};
const write = (lines) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(lines));
  window.dispatchEvent(new Event("sekotal-cart-change"));
};
function useCart() {
  const [lines, setLines] = reactExports.useState([]);
  reactExports.useEffect(() => {
    setLines(read());
    const onChange = () => setLines(read());
    window.addEventListener("sekotal-cart-change", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("sekotal-cart-change", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);
  const add = reactExports.useCallback((id, date, qty = 1) => {
    const current = read();
    const found = current.find((l) => l.id === id && l.date === date);
    let next;
    if (found) {
      next = current.map(
        (l) => l.id === id && l.date === date ? { ...l, qty: l.qty + qty } : l
      );
    } else {
      next = [...current, { id, date, qty }];
    }
    write(next);
  }, []);
  const setQty = reactExports.useCallback((id, date, qty) => {
    const current = read();
    const next = qty <= 0 ? current.filter((l) => !(l.id === id && l.date === date)) : current.map(
      (l) => l.id === id && l.date === date ? { ...l, qty } : l
    );
    write(next);
  }, []);
  const remove = reactExports.useCallback((id, date) => {
    write(read().filter((l) => !(l.id === id && l.date === date)));
  }, []);
  const clear = reactExports.useCallback(() => write([]), []);
  const totalItems = lines.reduce((s, l) => s + l.qty, 0);
  const groupByDate = () => {
    const groups = /* @__PURE__ */ new Map();
    lines.forEach((line) => {
      if (!groups.has(line.date)) groups.set(line.date, []);
      groups.get(line.date).push(line);
    });
    return groups;
  };
  return { lines, add, setQty, remove, clear, totalItems, groupByDate };
}
function useCartWithItems(menuItems) {
  const { lines, totalItems, groupByDate } = useCart();
  const items = lines.filter((l) => l.date).map((l) => {
    const m = menuItems.find((x) => x.id === l.id);
    return m ? { ...l, item: m } : null;
  }).filter((x) => !!x);
  const totalPrice = items.reduce((s, l) => s + l.qty * l.item.price, 0);
  const itemsByDate = () => {
    const groups = groupByDate();
    const result = /* @__PURE__ */ new Map();
    groups.forEach((lines2, date) => {
      if (!date) return;
      const dateItems = lines2.filter((l) => l.date).map((l) => {
        const m = menuItems.find((x) => x.id === l.id);
        return m ? { ...l, item: m } : null;
      }).filter((x) => !!x);
      if (dateItems.length > 0) {
        result.set(date, dateItems);
      }
    });
    return result;
  };
  return { lines, items, totalItems, totalPrice, groupByDate, itemsByDate };
}
export {
  Plus as P,
  useCartWithItems as a,
  useCart as u
};
