import { useState, useEffect } from "react";
import { s as supabase } from "./router-VI3ubcTf.js";
import { jsx } from "react/jsx-runtime";
import { c as cn } from "./utils-FX9JXj3v.js";
function useMenu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    supabase.from("menu_items").select("*").eq("is_available", true).order("category").then(({ data, error: err }) => {
      if (err) setError(err.message);
      else setItems(data ?? []);
      setLoading(false);
    });
  }, []);
  return { items, loading, error };
}
function useMenuByDate(date) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
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
  return /* @__PURE__ */ jsx(
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
  useMenuByDate as a,
  useMenu as u
};
