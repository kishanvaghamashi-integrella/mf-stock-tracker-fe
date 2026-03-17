import { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
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
  type TimeSeriesPoint,
  type HeatmapDay,
  fmtCurrency,
  GAIN_COLOR,
  LOSS_COLOR,
  INSTRUMENT_PALETTE,
} from "../../utils/dashboard";

interface Props {
  timeSeries: TimeSeriesPoint[];
  heatmap: HeatmapDay[];
  granularity: "day" | "week" | "month";
  onGranularityChange: (g: "day" | "week" | "month") => void;
  volumeMode: "count" | "value";
  onVolumeModeChange: (m: "count" | "value") => void;
  instrumentTypes: string[];
}

interface TooltipPayloadEntry {
  dataKey?: string;
  name?: string;
  value: number;
  color?: string;
  stroke?: string;
  fill?: string;
}
const CurrencyTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: ReadonlyArray<TooltipPayloadEntry>;
  label?: string | number;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <ChartTooltipWrapper>
      <ChartTooltipLabel>{label}</ChartTooltipLabel>
      {payload.map((p) => (
        <ChartTooltipRow key={p.dataKey} $color={p.color ?? p.stroke}>
          {p.name}:{" "}
          {p.dataKey?.includes("Count") ||
          (typeof p.value === "number" && p.value < 10000)
            ? p.value
            : fmtCurrency(p.value)}
        </ChartTooltipRow>
      ))}
    </ChartTooltipWrapper>
  );
};

const VolumeTooltip = ({
  active,
  payload,
  label,
  mode,
}: {
  active?: boolean;
  payload?: ReadonlyArray<TooltipPayloadEntry>;
  label?: string | number;
  mode: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <ChartTooltipWrapper>
      <ChartTooltipLabel>{label}</ChartTooltipLabel>
      {payload.map((p) => (
        <ChartTooltipRow key={p.name} $color={p.fill}>
          {p.name}: {mode === "value" ? fmtCurrency(p.value) : p.value}
        </ChartTooltipRow>
      ))}
    </ChartTooltipWrapper>
  );
};

const HeatmapTooltip = ({ day }: { day: HeatmapDay }) => (
  <ChartTooltipWrapper>
    <ChartTooltipLabel>{day.date}</ChartTooltipLabel>
    <ChartTooltipRow>
      {day.count} transaction{day.count !== 1 ? "s" : ""}
    </ChartTooltipRow>
    {day.assets.slice(0, 4).map((a) => (
      <ChartTooltipRow
        key={a}
        style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}
      >
        {a}
      </ChartTooltipRow>
    ))}
    {day.assets.length > 4 && (
      <ChartTooltipRow
        style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}
      >
        +{day.assets.length - 4} more
      </ChartTooltipRow>
    )}
  </ChartTooltipWrapper>
);

// GitHub-style heatmap
const CalendarHeatmap = ({ heatmap }: { heatmap: HeatmapDay[] }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [hovered, setHovered] = useState<HeatmapDay | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  if (!heatmap.length) return <EmptyChart>No transaction data.</EmptyChart>;

  const maxCount = Math.max(...heatmap.map((d) => d.count), 1);

  // Build a full calendar grid
  const dayMap = new Map(heatmap.map((d) => [d.date, d]));
  const first = new Date(heatmap[0].date);
  const last = new Date(heatmap[heatmap.length - 1].date);

  // Start from the Monday of the week containing `first`
  const start = new Date(first);
  const startDay = start.getDay();
  start.setDate(start.getDate() - (startDay === 0 ? 6 : startDay - 1));

  const weeks: (HeatmapDay | null)[][] = [];
  const current = new Date(start);

  while (current <= last) {
    const week: (HeatmapDay | null)[] = [];
    for (let d = 0; d < 7; d++) {
      const key = current.toISOString().slice(0, 10);
      week.push(
        current > last
          ? null
          : (dayMap.get(key) ?? { date: key, count: 0, assets: [], types: [] }),
      );
      current.setDate(current.getDate() + 1);
    }
    weeks.push(week);
  }

  const cellSize = 13;
  const gap = 2;

  const getColor = (count: number): string => {
    if (count === 0) return isDark ? "#322f28" : "#f1f5f9";
    const intensity = Math.ceil((count / maxCount) * 4);
    const greens = isDark
      ? ["#00402f", "#00694e", "#009671", "#00C896"]
      : ["#bbf7e1", "#6ee7c0", "#2dd4a4", "#00C896"];
    return greens[Math.min(intensity - 1, 3)];
  };

  const monthLabels: { label: string; x: number }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, wi) => {
    const day = week.find((d) => d !== null);
    if (day) {
      const m = new Date(day.date).getMonth();
      if (m !== lastMonth) {
        monthLabels.push({
          label: new Date(day.date).toLocaleString("default", {
            month: "short",
          }),
          x: wi * (cellSize + gap),
        });
        lastMonth = m;
      }
    }
  });

  const svgWidth = weeks.length * (cellSize + gap);
  const svgHeight = 7 * (cellSize + gap) + 20;

  return (
    <div style={{ position: "relative", overflowX: "auto" }}>
      <svg width={svgWidth} height={svgHeight}>
        {/* Month labels */}
        {monthLabels.map(({ label, x }) => (
          <text
            key={`${label}-${x}`}
            x={x}
            y={10}
            fontSize={10}
            fill={isDark ? "#9c9589" : "#64748b"}
          >
            {label}
          </text>
        ))}
        {/* Cells */}
        {weeks.map((week, wi) =>
          week.map((day, di) => {
            if (!day) return null;
            const x = wi * (cellSize + gap);
            const y = 18 + di * (cellSize + gap);
            return (
              <rect
                key={`${wi}-${di}`}
                x={x}
                y={y}
                width={cellSize}
                height={cellSize}
                rx={2}
                fill={getColor(day.count)}
                style={{ cursor: day.count > 0 ? "pointer" : "default" }}
                onMouseEnter={(e) => {
                  setHovered(day);
                  setTooltipPos({ x: e.clientX, y: e.clientY });
                }}
                onMouseLeave={() => setHovered(null)}
              />
            );
          }),
        )}
      </svg>
      {hovered && hovered.count > 0 && (
        <div
          style={{
            position: "fixed",
            top: tooltipPos.y + 12,
            left: tooltipPos.x + 12,
            zIndex: 100,
            pointerEvents: "none",
          }}
        >
          <HeatmapTooltip day={hovered} />
        </div>
      )}
    </div>
  );
};

const TransactionCharts = ({
  timeSeries,
  heatmap,
  granularity,
  onGranularityChange,
  volumeMode,
  onVolumeModeChange,
  instrumentTypes,
}: Props) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const gridColor = isDark ? "#3d3a34" : "#e2e8f0";
  const tickColor = isDark ? "#9c9589" : "#64748b";

  if (!timeSeries.length) {
    return (
      <EmptyChart>No transaction data for the selected filters.</EmptyChart>
    );
  }

  const granularityControl = (
    <ToggleGroup>
      {(["day", "week", "month"] as const).map((g) => (
        <ToggleButton
          key={g}
          $active={granularity === g}
          onClick={() => onGranularityChange(g)}
        >
          {g.charAt(0).toUpperCase() + g.slice(1)}
        </ToggleButton>
      ))}
    </ToggleGroup>
  );

  // Determine which instrument type lines to draw for 4a multi-line
  const allTypes = instrumentTypes.slice(0, 5); // cap at 5 lines for readability

  return (
    <>
      {/* 4a — Cumulative investment */}
      <ChartsRow>
        <DashboardPanel>
          <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
            <SectionTitle style={{ marginBottom: 0 }}>
              Cumulative Investment Over Time
            </SectionTitle>
            {granularityControl}
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart
              data={timeSeries}
              margin={{ top: 8, right: 16, bottom: 8, left: 16 }}
            >
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                stroke={gridColor}
              />
              <XAxis
                dataKey="date"
                tick={{ fill: tickColor, fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: tickColor, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => "₹" + (v / 1000).toFixed(0) + "k"}
              />
              <Tooltip content={(p) => <CurrencyTooltip {...p} />} />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: "0.75rem", color: tickColor }}
              />
              <Line
                type="monotone"
                dataKey="cumulative"
                name="Total"
                stroke={isDark ? "#5b8cfa" : "#3b82f6"}
                strokeWidth={2}
                dot={false}
              />
              {allTypes.map((type, i) => (
                <Line
                  key={type}
                  type="monotone"
                  dataKey={`byType.${type}`}
                  name={type}
                  stroke={INSTRUMENT_PALETTE[i % INSTRUMENT_PALETTE.length]}
                  strokeWidth={1.5}
                  dot={false}
                  strokeDasharray="4 2"
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </DashboardPanel>
      </ChartsRow>

      <ChartsRowHalves>
        {/* 4b — Transaction volume */}
        <DashboardPanel>
          <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
            <SectionTitle style={{ marginBottom: 0 }}>
              Transaction Volume by Date
            </SectionTitle>
            <ToggleGroup>
              {(["count", "value"] as const).map((m) => (
                <ToggleButton
                  key={m}
                  $active={volumeMode === m}
                  onClick={() => onVolumeModeChange(m)}
                >
                  {m.charAt(0).toUpperCase() + m.slice(1)}
                </ToggleButton>
              ))}
            </ToggleGroup>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={timeSeries}
              margin={{ top: 8, right: 8, bottom: 8, left: 0 }}
            >
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                stroke={gridColor}
              />
              <XAxis
                dataKey="date"
                tick={{ fill: tickColor, fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: tickColor, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={
                  volumeMode === "value"
                    ? (v) => "₹" + (v / 1000).toFixed(0) + "k"
                    : undefined
                }
              />
              <Tooltip
                content={(p) => <VolumeTooltip {...p} mode={volumeMode} />}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: "0.75rem", color: tickColor }}
              />
              <Bar
                dataKey={volumeMode === "value" ? "buy" : "buyCount"}
                name="BUY"
                stackId="a"
                fill={GAIN_COLOR}
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey={volumeMode === "value" ? "sell" : "sellCount"}
                name="SELL"
                stackId="a"
                fill={LOSS_COLOR}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </DashboardPanel>

        {/* 4c — Area chart cumulative investment */}
        <DashboardPanel>
          <SectionTitle>Portfolio Value Trend</SectionTitle>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart
              data={timeSeries}
              margin={{ top: 8, right: 8, bottom: 8, left: 0 }}
            >
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={GAIN_COLOR} stopOpacity={0.35} />
                  <stop
                    offset="95%"
                    stopColor={GAIN_COLOR}
                    stopOpacity={0.02}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                stroke={gridColor}
              />
              <XAxis
                dataKey="date"
                tick={{ fill: tickColor, fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: tickColor, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => "₹" + (v / 1000).toFixed(0) + "k"}
              />
              <Tooltip content={<CurrencyTooltip />} />
              <Area
                type="stepAfter"
                dataKey="cumulative"
                name="Cumulative"
                stroke={GAIN_COLOR}
                strokeWidth={2}
                fill="url(#areaGradient)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </DashboardPanel>
      </ChartsRowHalves>

      {/* 4d — Heatmap */}
      <ChartsRow>
        <DashboardPanel>
          <SectionTitle>Trading Activity Calendar</SectionTitle>
          <CalendarHeatmap heatmap={heatmap} />
        </DashboardPanel>
      </ChartsRow>
    </>
  );
};

export default TransactionCharts;
