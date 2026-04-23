export interface DbMenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string;
  is_available: boolean;
  created_at: string | null;
}

export interface DbCustomer {
  id: string;
  name: string;
  phone: string;
  password_hash?: string;
  email?: string;
  created_at: string | null;
}

export interface DbOrder {
  id: string;
  customer_id: string;
  total_amount: number;
  status: string;
  delivery_date: string | null;
  created_at: string | null;
}

export interface DbOrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  quantity: number;
  price: number;
}

export interface DbMenuSchedule {
  id: string;
  menu_item_id: string;
  available_date: string;
  created_at: string | null;
}
