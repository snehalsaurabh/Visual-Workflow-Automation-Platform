export type PaperOrderInput = {
  exchange: string;
  asset: string;
  side: "long" | "short" | "close";
  quantity: number;
  leverage?: number;
  orderType?: "market" | "limit";
};

export type PaperOrderResult = {
  filledQty: number;
  avgPrice: number;
  notionalUsd: number;
  pnlUsd: number;
  orderId: string;
};

export async function placePaperOrder(input: PaperOrderInput): Promise<PaperOrderResult> {
  const seed = Math.abs(hash(`${input.exchange}-${input.asset}-${Date.now()}`));
  const avgPrice = 100 + (seed % 10_000) / 100;
  const filledQty = Math.max(0, input.quantity);
  const notionalUsd = filledQty * avgPrice;
  const pnlUsd = (seed % 2 === 0 ? 1 : -1) * ((seed % 5000) / 100);

  return {
    filledQty,
    avgPrice,
    notionalUsd,
    pnlUsd,
    orderId: `paper-${seed}`,
  };
}

function hash(value: string) {
  let h = 0;
  for (let i = 0; i < value.length; i++) {
    h = (h << 5) - h + value.charCodeAt(i);
    h |= 0;
  }
  return h;
}

