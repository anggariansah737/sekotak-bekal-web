import { c as createLucideIcon, a as cn } from "./utils-D47OA262.js";
import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-BvBN2c8W.js";
import { s as supabase } from "./router-7dEjMhRs.js";
const __iconNode = [
  ["path", { d: "M16 10a4 4 0 0 1-8 0", key: "1ltviw" }],
  ["path", { d: "M3.103 6.034h17.794", key: "awc11p" }],
  [
    "path",
    {
      d: "M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z",
      key: "o988cm"
    }
  ]
];
const ShoppingBag = createLucideIcon("shopping-bag", __iconNode);
function useMenu() {
  const [items, setItems] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  reactExports.useEffect(() => {
    supabase.from("menu_items").select("*").eq("is_available", true).order("category").then(({ data, error: err }) => {
      if (err) setError(err.message);
      else setItems(data ?? []);
      setLoading(false);
    });
  }, []);
  return { items, loading, error };
}
function useMenuByDate(date) {
  const [items, setItems] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  reactExports.useEffect(() => {
    supabase.from("menu_schedules").select("*, menu_items(*)").eq("available_date", date).then(({ data, error: err }) => {
      if (err) {
        setError(err.message);
      } else {
        const menuItems = (data ?? []).map((schedule) => schedule.menu_items).filter(Boolean);
        setItems(menuItems);
      }
      setLoading(false);
    });
  }, [date]);
  return { items, loading, error };
}
const styles = {
  POPULER: "bg-primary text-primary-foreground",
  VEGAN: "bg-success text-success-foreground",
  "NUTRISI+": "bg-success-soft text-success",
  ANAK: "bg-accent text-accent-foreground",
  PEDAS: "bg-destructive text-destructive-foreground"
};
function CategoryBadge({
  category,
  className
}) {
  const style = styles[category] || "bg-muted text-foreground";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase",
        style,
        className
      ),
      children: category
    }
  );
}
export {
  CategoryBadge as C,
  ShoppingBag as S,
  useMenuByDate as a,
  useMenu as u
};
