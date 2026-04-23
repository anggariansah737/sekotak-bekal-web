// Ganti nomor di sini untuk integrasi WhatsApp asli
export const WHATSAPP_NUMBER = "628123456789";

export function buildWhatsAppUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
