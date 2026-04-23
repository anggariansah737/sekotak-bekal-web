import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { DbMenuItem } from "@/types/database";

export function useMenu() {
  const [items, setItems] = useState<DbMenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("menu_items")
      .select("*")
      .eq("is_available", true)
      .order("category")
      .then(({ data, error: err }) => {
        if (err) setError(err.message);
        else setItems(data ?? []);
        setLoading(false);
      });
  }, []);

  return { items, loading, error };
}

export function useMenuByDate(date: string) {
  const [items, setItems] = useState<DbMenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("menu_schedules")
      .select("*, menu_items(*)")
      .eq("available_date", date)
      .then(({ data, error: err }) => {
        if (err) {
          setError(err.message);
        } else {
          const menuItems = (data ?? [])
            .map((schedule: any) => schedule.menu_items)
            .filter(Boolean);
          setItems(menuItems);
        }
        setLoading(false);
      });
  }, [date]);

  return { items, loading, error };
}

export function useMenuItemById(id: string) {
  const [item, setItem] = useState<DbMenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("menu_items")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error: err }) => {
        if (err) setError(err.message);
        else setItem(data);
        setLoading(false);
      });
  }, [id]);

  return { item, loading, error };
}
