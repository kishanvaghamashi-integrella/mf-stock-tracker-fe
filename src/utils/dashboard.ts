import type { Holding, Transaction } from "../types";

// ─── Formatting ───────────────────────────────────────────────────────────────

export const fmtCurrency = (n: number): string =>
  "₹" +
  n.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export const fmtPct = (n: number): string =>
  (n >= 0 ? "+" : "") + n.toFixed(2) + "%";

export const fmtNum = (n: number): string =>
  n.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

// ─── KPI Summaries ────────────────────────────────────────────────────────────

export interface PortfolioKPIs {
  totalInvested: number;
  currentValue: number;
  totalPnL: number;
  overallReturnPct: number;
}

export const computeKPIs = (holdings: Holding[]): PortfolioKPIs => {
  const totalInvested = holdings.reduce((s, h) => s + h.invested_capital, 0);
  const currentValue = holdings.reduce((s, h) => s + h.current_capital, 0);
  const totalPnL = currentValue - totalInvested;
  const overallReturnPct =
    totalInvested === 0 ? 0 : (totalPnL / totalInvested) * 100;
  return { totalInvested, currentValue, totalPnL, overallReturnPct };
};

// ─── Instrument-type grouping ─────────────────────────────────────────────────

export interface InstrumentGroup {
  type: string;
  invested: number;
  current: number;
  pnl: number;
  returnPct: number;
}

export const groupByInstrumentType = (
  holdings: Holding[],
): InstrumentGroup[] => {
  const map = new Map<string, { invested: number; current: number }>();
  for (const h of holdings) {
    const existing = map.get(h.asset_instrument_type) ?? {
      invested: 0,
      current: 0,
    };
    map.set(h.asset_instrument_type, {
      invested: existing.invested + h.invested_capital,
      current: existing.current + h.current_capital,
    });
  }
  return Array.from(map.entries()).map(([type, { invested, current }]) => ({
    type,
    invested,
    current,
    pnl: current - invested,
    returnPct: invested === 0 ? 0 : ((current - invested) / invested) * 100,
  }));
};

// ─── Asset-level data ─────────────────────────────────────────────────────────

export const sortedHoldingsByCurrentCapital = (
  holdings: Holding[],
  n: number | "all",
): Holding[] => {
  const sorted = [...holdings].sort(
    (a, b) => b.current_capital - a.current_capital,
  );
  return n === "all" ? sorted : sorted.slice(0, n);
};

// ─── Date helpers ─────────────────────────────────────────────────────────────

const weekStart = (d: Date): Date => {
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday
  return new Date(d.getFullYear(), d.getMonth(), diff);
};

export type Granularity = "day" | "week" | "month";

const bucketKey = (iso: string, gran: Granularity): string => {
  const d = new Date(iso);
  if (gran === "day") return d.toISOString().slice(0, 10);
  if (gran === "week") return weekStart(d).toISOString().slice(0, 10);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

export interface TimeSeriesPoint {
  date: string;
  cumulative: number;
  buy: number;
  sell: number;
  buyCount: number;
  sellCount: number;
  totalCount: number;
  byType: Record<string, number>; // instrument type -> cumulative value
}

export const buildTimeSeries = (
  transactions: Transaction[],
  gran: Granularity,
  dateRange: [string, string] | null,
  instrumentFilter: string[],
): TimeSeriesPoint[] => {
  let txns = [...transactions];

  if (dateRange) {
    const [from, to] = dateRange;
    txns = txns.filter((t) => {
      const d = t.txn_date.slice(0, 10);
      return d >= from && d <= to;
    });
  }

  if (instrumentFilter.length > 0) {
    txns = txns.filter((t) =>
      instrumentFilter.includes(t.asset_instrument_type),
    );
  }

  txns.sort((a, b) => a.txn_date.localeCompare(b.txn_date));

  // Build bucket maps
  const buyMap = new Map<string, number>();
  const sellMap = new Map<string, number>();
  const buyCountMap = new Map<string, number>();
  const sellCountMap = new Map<string, number>();
  const typeMap = new Map<string, Map<string, number>>(); // key -> type -> value

  for (const t of txns) {
    const key = bucketKey(t.txn_date, gran);
    const val = t.price * t.quantity;
    if (t.txn_type === "BUY") {
      buyMap.set(key, (buyMap.get(key) ?? 0) + val);
      buyCountMap.set(key, (buyCountMap.get(key) ?? 0) + 1);

      if (!typeMap.has(key)) typeMap.set(key, new Map());
      const tm = typeMap.get(key)!;
      tm.set(
        t.asset_instrument_type,
        (tm.get(t.asset_instrument_type) ?? 0) + val,
      );
    } else {
      sellMap.set(key, (sellMap.get(key) ?? 0) + val);
      sellCountMap.set(key, (sellCountMap.get(key) ?? 0) + 1);
    }
  }

  const allKeys = Array.from(
    new Set([...buyMap.keys(), ...sellMap.keys()]),
  ).sort();

  let cumulative = 0;
  const cumulativeByType: Record<string, number> = {};

  return allKeys.map((date) => {
    const buy = buyMap.get(date) ?? 0;
    const sell = sellMap.get(date) ?? 0;
    cumulative += buy - sell;

    const tm = typeMap.get(date);
    if (tm) {
      for (const [type, val] of tm.entries()) {
        cumulativeByType[type] = (cumulativeByType[type] ?? 0) + val;
      }
    }

    return {
      date,
      cumulative,
      buy,
      sell,
      buyCount: buyCountMap.get(date) ?? 0,
      sellCount: sellCountMap.get(date) ?? 0,
      totalCount: (buyCountMap.get(date) ?? 0) + (sellCountMap.get(date) ?? 0),
      byType: { ...cumulativeByType },
    };
  });
};

// ─── Heatmap ──────────────────────────────────────────────────────────────────

export interface HeatmapDay {
  date: string; // YYYY-MM-DD
  count: number;
  assets: string[];
  types: string[];
}

export const buildHeatmap = (transactions: Transaction[]): HeatmapDay[] => {
  const map = new Map<
    string,
    { count: number; assets: Set<string>; types: Set<string> }
  >();

  for (const t of transactions) {
    const key = t.txn_date.slice(0, 10);
    if (!map.has(key))
      map.set(key, { count: 0, assets: new Set(), types: new Set() });
    const entry = map.get(key)!;
    entry.count++;
    entry.assets.add(t.asset_name);
    entry.types.add(t.txn_type);
  }

  return Array.from(map.entries())
    .map(([date, { count, assets, types }]) => ({
      date,
      count,
      assets: Array.from(assets),
      types: Array.from(types),
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
};

// ─── Instrument type color palette ───────────────────────────────────────────

export const INSTRUMENT_COLORS: Record<string, string> = {
  EQUITY: "#4E9AF1",
  STOCK: "#4E9AF1",
  MUTUAL_FUND: "#00C896",
  ETF: "#F5A623",
  BOND: "#9B59B6",
  CRYPTO: "#F39C12",
  GOLD: "#FFD700",
  REIT: "#E74C3C",
};

export const getInstrumentColor = (type: string): string =>
  INSTRUMENT_COLORS[type?.toUpperCase()] ?? "#8E9BAE";

export const INSTRUMENT_PALETTE = [
  "#4E9AF1",
  "#00C896",
  "#F5A623",
  "#9B59B6",
  "#F39C12",
  "#FFD700",
  "#E74C3C",
  "#8E9BAE",
];

export const GAIN_COLOR = "#00C896";
export const LOSS_COLOR = "#FF4D6D";
export const NEUTRAL_COLOR = "#4E9AF1";

export const pnlColor = (val: number): string =>
  val >= 0 ? GAIN_COLOR : LOSS_COLOR;
