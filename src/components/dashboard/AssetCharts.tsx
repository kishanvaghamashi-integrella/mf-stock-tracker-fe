import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ScatterChart,
  Scatter,
  ResponsiveContainer,
  ZAxis,
} from "recharts";
import { useTheme } from "../../context/ThemeContext";
import {
  DashboardPanel,
  SectionTitle,
  ChartsRowHalves,
  ChartsRow,
  ChartTooltipWrapper,
  ChartTooltipLabel,
  ChartTooltipRow,
  ToggleGroup,
  ToggleButton,
  EmptyChart,
} from "../../pages/Dashboard.styled";
import {
  fmtCurrency,
  fmtPct,
  getInstrumentColor,
  GAIN_COLOR,
  LOSS_COLOR,
  sortedHoldingsByCurrentCapital,
} from "../../utils/dashboard";
import type { Holding } from "../../types";

interface Props {
  holdings: Holding[];
  instrumentFilter: string | null;
  onAssetClick: (assetName: string) => void;
}

type TopN = 5 | 10 | "all";

const AssetTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: Holding }[];
}) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload as Holding;
  return (
    <ChartTooltipWrapper>
      <ChartTooltipLabel>{d.asset_name}</ChartTooltipLabel>
      <ChartTooltipRow>Type: {d.asset_instrument_type}</ChartTooltipRow>
      <ChartTooltipRow>
        Current Value: {fmtCurrency(d.current_capital)}
      </ChartTooltipRow>
      <ChartTooltipRow>
        Invested: {fmtCurrency(d.invested_capital)}
      </ChartTooltipRow>
      <ChartTooltipRow
        $color={d.return_percentage >= 0 ? GAIN_COLOR : LOSS_COLOR}
      >
        Return: {fmtPct(d.return_percentage)}
      </ChartTooltipRow>
    </ChartTooltipWrapper>
  );
};

const BubbleTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: Holding }[];
}) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload as Holding;
  return (
    <ChartTooltipWrapper>
      <ChartTooltipLabel>{d.asset_name}</ChartTooltipLabel>
      <ChartTooltipRow>Type: {d.asset_instrument_type}</ChartTooltipRow>
      <ChartTooltipRow>
        Avg. Price: {fmtCurrency(d.average_price)}
      </ChartTooltipRow>
      <ChartTooltipRow>Qty: {d.quantity}</ChartTooltipRow>
      <ChartTooltipRow
        $color={d.return_percentage >= 0 ? GAIN_COLOR : LOSS_COLOR}
      >
        Return: {fmtPct(d.return_percentage)}
      </ChartTooltipRow>
    </ChartTooltipWrapper>
  );
};

const StackedTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; fill: string }[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <ChartTooltipWrapper>
      <ChartTooltipLabel>{label}</ChartTooltipLabel>
      {payload.map((p) => (
        <ChartTooltipRow key={p.name} $color={p.fill}>
          {p.name}: {fmtCurrency(p.value)}
        </ChartTooltipRow>
      ))}
    </ChartTooltipWrapper>
  );
};

const AssetCharts = ({ holdings, instrumentFilter, onAssetClick }: Props) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const gridColor = isDark ? "#3d3a34" : "#e2e8f0";
  const tickColor = isDark ? "#9c9589" : "#64748b";

  const [topN, setTopN] = useState<TopN>(10);

  const filtered = instrumentFilter
    ? holdings.filter((h) => h.asset_instrument_type === instrumentFilter)
    : holdings;

  const topHoldings = sortedHoldingsByCurrentCapital(filtered, topN);

  // For scatter we need all filtered
  const scatterData = filtered;

  // Stacked bar: invested + delta (gain or loss overlay)
  const stackedData = [...filtered]
    .sort((a, b) => b.invested_capital - a.invested_capital)
    .map((h) => ({
      ...h,
      gain:
        h.return_percentage >= 0 ? h.current_capital - h.invested_capital : 0,
      loss:
        h.return_percentage < 0 ? h.invested_capital - h.current_capital : 0,
    }));

  if (!filtered.length) {
    return <EmptyChart>No asset data available.</EmptyChart>;
  }

  return (
    <>
      {/* 3a — Top N Holdings */}
      <ChartsRow>
        <DashboardPanel>
          <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
            <SectionTitle style={{ marginBottom: 0 }}>
              Top Holdings by Current Value
            </SectionTitle>
            <ToggleGroup>
              {([5, 10, "all"] as TopN[]).map((n) => (
                <ToggleButton
                  key={String(n)}
                  $active={topN === n}
                  onClick={() => setTopN(n)}
                >
                  {n === "all" ? "All" : `Top ${n}`}
                </ToggleButton>
              ))}
            </ToggleGroup>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={topHoldings}
              margin={{ top: 8, right: 16, left: 10, bottom: 60 }}
              onClick={(d: unknown) => {
                const ev = d as { activePayload?: { payload: Holding }[] };
                if (ev?.activePayload?.[0]) {
                  onAssetClick(ev.activePayload[0].payload.asset_name);
                }
              }}
            >
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                stroke={gridColor}
              />
              <XAxis
                dataKey="asset_name"
                tick={{ fill: tickColor, fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                angle={-35}
                textAnchor="end"
                interval={0}
              />
              <YAxis
                tick={{ fill: tickColor, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => "₹" + (v / 1000).toFixed(0) + "k"}
              />
              <Tooltip content={<AssetTooltip />} />
              <Bar
                dataKey="current_capital"
                radius={[4, 4, 0, 0]}
                style={{ cursor: "pointer" }}
              >
                {topHoldings.map((h) => (
                  <Cell
                    key={h.asset_name}
                    fill={h.return_percentage >= 0 ? GAIN_COLOR : LOSS_COLOR}
                    fillOpacity={
                      0.5 +
                      0.5 *
                        (Math.abs(h.return_percentage) /
                          Math.max(
                            ...topHoldings.map((x) =>
                              Math.abs(x.return_percentage),
                            ),
                            1,
                          ))
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p
            style={{
              fontSize: "0.72rem",
              color: tickColor,
              marginTop: "0.25rem",
            }}
          >
            Click a bar to see transaction history
          </p>
        </DashboardPanel>
      </ChartsRow>

      <ChartsRowHalves>
        {/* 3b — Bubble / Scatter */}
        <DashboardPanel>
          <SectionTitle>Risk vs Return (Bubble = Qty)</SectionTitle>
          <ResponsiveContainer width="100%" height={280}>
            <ScatterChart margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis
                dataKey="average_price"
                name="Avg Price"
                tick={{ fill: tickColor, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => "₹" + (v / 1000).toFixed(1) + "k"}
                label={{
                  value: "Avg Price",
                  position: "insideBottom",
                  offset: -2,
                  fill: tickColor,
                  fontSize: 10,
                }}
              />
              <YAxis
                dataKey="return_percentage"
                name="Return %"
                tick={{ fill: tickColor, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v.toFixed(0)}%`}
              />
              <ZAxis dataKey="quantity" range={[40, 400]} name="Qty" />
              <Tooltip content={<BubbleTooltip />} />
              <Scatter data={scatterData} fill="#4E9AF1">
                {scatterData.map((h) => (
                  <Cell
                    key={h.asset_name}
                    fill={getInstrumentColor(h.asset_instrument_type)}
                    fillOpacity={0.75}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </DashboardPanel>

        {/* 3c — Stacked capital breakdown */}
        <DashboardPanel>
          <SectionTitle>Invested Capital Breakdown per Asset</SectionTitle>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={stackedData}
              layout="vertical"
              margin={{ left: 0, right: 40, top: 8, bottom: 8 }}
            >
              <CartesianGrid
                horizontal={false}
                strokeDasharray="3 3"
                stroke={gridColor}
              />
              <XAxis
                type="number"
                tick={{ fill: tickColor, fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => "₹" + (v / 1000).toFixed(0) + "k"}
              />
              <YAxis
                type="category"
                dataKey="asset_name"
                tick={{ fill: tickColor, fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={80}
              />
              <Tooltip content={<StackedTooltip />} />
              <Bar
                dataKey="invested_capital"
                name="Invested"
                stackId="a"
                fill="#4E9AF1"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="gain"
                name="Gain"
                stackId="a"
                fill={GAIN_COLOR}
                radius={[0, 4, 4, 0]}
              />
              <Bar
                dataKey="loss"
                name="Loss"
                stackId="a"
                fill={LOSS_COLOR}
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </DashboardPanel>
      </ChartsRowHalves>
    </>
  );
};

export default AssetCharts;
