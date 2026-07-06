export const currencies = [
  { code: "NGN", symbol: "₦", name: "Nigerian Naira", country: "Nigeria" },
  { code: "USD", symbol: "$", name: "US Dollar", country: "United States" },
  { code: "GBP", symbol: "£", name: "British Pound", country: "United Kingdom" },
  { code: "EUR", symbol: "€", name: "Euro", country: "Europe" },
  { code: "GHS", symbol: "GH₵", name: "Ghanaian Cedi", country: "Ghana" },
  { code: "KES", symbol: "KSh", name: "Kenyan Shilling", country: "Kenya" },
  { code: "ZAR", symbol: "R", name: "South African Rand", country: "South Africa" },
  { code: "CAD", symbol: "CA$", name: "Canadian Dollar", country: "Canada" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar", country: "Australia" },
  { code: "INR", symbol: "₹", name: "Indian Rupee", country: "India" },
];

export function formatCurrency(amount: number, currencyCode: string = "NGN"): string {
  const currency = currencies.find((c) => c.code === currencyCode);
  const symbol = currency ? currency.symbol : "₦";
  return `${symbol}${amount.toLocaleString()}`;
}

export function getCurrencySymbol(currencyCode: string): string {
  const currency = currencies.find((c) => c.code === currencyCode);
  return currency ? currency.symbol : "₦";
}