export const WHATSAPP_NUMBER = '5516991023129';

export const WHATSAPP_URL =
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Ol\u00E1! Gostaria de fazer uma reserva no Dallas Motel.')}`;

export const MAPS_URL =
  'https://maps.google.com/?q=Estrada+Municipal+Pitangueiras+Viradouro+km+3.5+Pitangueiras+SP';

export function buildBookingUrl(suiteName: string, hours: number): string {
  const text = encodeURIComponent(
    `Ol\u00E1! Gostaria de reservar a ${suiteName} por ${hours} horas no Dallas Motel.`
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}
