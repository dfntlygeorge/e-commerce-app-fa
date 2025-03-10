export function formatCurrency(
  amount: number,
  currencyCode: string = "USD",
): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode.toUpperCase(),
    }).format(amount);
  } catch (err) {
    // Fallback formatting if currency code is invalid
    console.error("Invalid currency code", currencyCode, err);
    return `${currencyCode.toUpperCase()} ${amount.toFixed(2)} `;
  }
}
