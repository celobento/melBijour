/**
 * Formats a number as Brazilian Real (BRL) currency
 */
export function formatCurrencyBr(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

