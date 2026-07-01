export function formatPrice(value, currency = 'CHF') {
  if (typeof value !== 'number') {
    return 'Preis offen';
  }

  return `${currency} ${value.toFixed(2)}`;
}
