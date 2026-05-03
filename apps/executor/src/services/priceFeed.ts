type PriceFeedProvider = "coingecko";

export async function getUsdPrice(provider: PriceFeedProvider, symbol: string) {
  if (provider !== "coingecko") {
    throw new Error(`Unsupported price provider: ${provider}`);
  }

  const id = symbol.toLowerCase() === "sol" ? "solana" : symbol.toLowerCase();
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(id)}&vs_currencies=usd`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Price feed failed (${res.status})`);
  }
  const json = (await res.json()) as Record<string, { usd?: number }>;
  const usd = json?.[id]?.usd;
  if (typeof usd !== "number") {
    throw new Error("Price feed returned no USD price");
  }
  return usd;
}

