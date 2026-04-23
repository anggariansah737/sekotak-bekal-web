import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import type { DbOrder, DbOrderItem, DbMenuItem } from "@/types/database";

export interface OrderWithItems extends DbOrder {
  items: Array<
    DbOrderItem & {
      menu_items: DbMenuItem | null;
    }
  >;
}

export function useOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }
    supabase
      .from("orders")
      .select("*, order_items(*, menu_items(*))")
      .eq("customer_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data, error: err }) => {
        if (err) setError(err.message);
        else setOrders((data as OrderWithItems[]) ?? []);
        setLoading(false);
      });
  }, [user]);

  return { orders, loading, error };
}
