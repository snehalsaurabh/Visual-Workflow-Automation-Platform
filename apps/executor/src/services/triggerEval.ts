type TriggerOperator = "below" | "above";

export type TriggerEvalResult =
  | { shouldRun: true; reason: string }
  | { shouldRun: false; reason: string };

export function evalPriceTrigger(opts: { operator: TriggerOperator; threshold: number; current: number }): TriggerEvalResult {
  const { operator, threshold, current } = opts;
  if (operator === "below") {
    return current < threshold
      ? { shouldRun: true, reason: `price ${current} < ${threshold}` }
      : { shouldRun: false, reason: `price ${current} >= ${threshold}` };
  }
  return current > threshold
    ? { shouldRun: true, reason: `price ${current} > ${threshold}` }
    : { shouldRun: false, reason: `price ${current} <= ${threshold}` };
}

export function evalTimerTrigger(opts: { lastSuccessAtMs: number | null; intervalMinutes: number }): TriggerEvalResult {
  const { lastSuccessAtMs, intervalMinutes } = opts;
  const intervalMs = Math.max(1, intervalMinutes) * 60_000;
  const now = Date.now();
  if (!lastSuccessAtMs) {
    return { shouldRun: true, reason: "no previous success execution" };
  }
  return now - lastSuccessAtMs >= intervalMs
    ? { shouldRun: true, reason: `interval elapsed (${intervalMinutes}m)` }
    : { shouldRun: false, reason: "interval not elapsed yet" };
}

