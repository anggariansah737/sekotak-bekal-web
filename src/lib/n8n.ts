const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;

export interface OrderWebhookPayload {
  customerName: string;
  customerPhone: string;
  orders: Array<{
    deliveryDate: string;
    items: Array<{ name: string; quantity: number; price: number }>;
    subtotal: number;
  }>;
  totalAmount: number;
  orderDate: string;
}

export async function triggerOrderWebhook(
  payload: OrderWebhookPayload,
): Promise<void> {
  if (!webhookUrl) {
    console.error("Missing VITE_N8N_WEBHOOK_URL");
    throw new Error("n8n webhook URL not configured");
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Webhook failed: ${response.status}`);
  }
}
