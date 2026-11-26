export const SAMPLE_QUOTES = {
  warehouse: { amountUsd: 1130, endpoint: "warehouse" },
  port: { amountUsd: 1100, endpoint: "port" },
} as const;

// The incremental charge only resolves this comparison if it covers all scope gaps.
export const SAMPLE_QUOTE_GAP_USD = SAMPLE_QUOTES.warehouse.amountUsd - SAMPLE_QUOTES.port.amountUsd;
