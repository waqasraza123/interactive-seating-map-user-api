import type { PriceTier } from "@interactive-seating-map/shared";

export const PRICE_BY_TIER: Record<PriceTier, number> = {
  premium: 85,
  standard: 55,
  vip: 125
};

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: 0,
    style: "currency"
  }).format(amount);
}
