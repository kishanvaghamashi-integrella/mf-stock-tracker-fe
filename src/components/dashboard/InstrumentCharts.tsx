import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
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
  EmptyChart,
} from "../../pages/Dashboard.styled";
import {
  type InstrumentGroup,
  INSTRUMENT_PALETTE,
  fmtCurrency,
  fmtPct,
  pnlColor,
} from "../../utils/dashboard";

interface Props {
  groups: InstrumentGroup[];
  onSliceClick: (type: string) => void;
}

const CustomPieTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { name: string; value: number; payload: { pct?: number } }[];
}) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <ChartTooltipWrapper>
      <ChartTooltipLabel>{d.name}</ChartTooltipLabel>
      <ChartTooltipRow>{fmtCurrency(d.value)}</ChartTooltipRow>
      <ChartTooltipRow>{d.payload.pct?.toFixed(2)}%</ChartTooltipRow>
    </ChartTooltipWrapper>
  );
};

const CustomBarTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <ChartTooltipWrapper>
      <ChartTooltipLabel>{label}</ChartTooltipLabel>
      {payload.map((p) => (
        <ChartTooltipRow key={p.name} $color={p.color}>
          {p.name}: {fmtCurrency(p.value)}
        </ChartTooltipRow>
      ))}
    </ChartTooltipWrapper>
  );
};

const CustomReturnTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <ChartTooltipWrapper>
      <ChartTooltipLabel>{label}</ChartTooltipLabel>
      <ChartTooltipRow>{fmtPct(payload[0].value)}</ChartTooltipRow>
    </ChartTooltipWrapper>
  );
};

const InstrumentCharts = ({ groups, onSliceClick }: Props) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const gridColor = isDark ? "#3d3a34" : "#e2e8f0";
  const tickColor = isDark ? "#9c9589" : "#64748b";

  const totalCurrent = groups.reduce((s, g) => s + g.current, 0);

  const pieData = groups.map((g, i) => ({
    name: g.type,
    value: g.current,
    pct: totalCurrent > 0 ? (g.current / totalCurrent) * 100 : 0,
    color: INSTRUMENT_PALETTE[i % INSTRUMENT_PALETTE.length],
  }));

  const barData = groups.map((g, i) => ({
    type: g.type,
    Invested: g.invested,
    Current: g.current,
    delta: g.pnl,
    color: INSTRUMENT_PALETTE[i % INSTRUMENT_PALETTE.length],
  }));

  const returnData = [...groups]
    .sort((a, b) => a.returnPct - b.returnPct)
    .map((g) => ({
      type: g.type,
      Return: g.returnPct,
      color: pnlColor(g.returnPct),
    }));

  if (!groups.length) {
    return <EmptyChart>No instrument data available.</EmptyChart>;
  }

  return (
    <>
      <ChartsRowHalves>
        {/* 2a — Donut chart */}
        <DashboardPanel>
          <SectionTitle>Capital Allocation by Type</SectionTitle>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius="50%"
                outerRadius="78%"
                paddingAngle={2}
                onClick={(d) => onSliceClick(d.name)}
                style={{ cursor: "pointer" }}
              >
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: "0.75rem", color: tickColor }}
              />
            </PieChart>
          </ResponsiveContainer>
        </DashboardPanel>

        {/* 2c — Return % horizontal bar */}
        <DashboardPanel>
          <SectionTitle>Avg. Return % by Type</SectionTitle>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={returnData}
              layout="vertical"
              margin={{ left: 0, right: 24, top: 8, bottom: 8 }}
            >
              <CartesianGrid
                horizontal={false}
                strokeDasharray="3 3"
                stroke={gridColor}
              />
              <XAxis
                type="number"
                tick={{ fill: tickColor, fontSize: 11 }}
                tickFormatter={(v) => `${v.toFixed(1)}%`}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="type"
                tick={{ fill: tickColor, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={90}
              />
              <Tooltip content={<CustomReturnTooltip />} />
              <Bar dataKey="Return" radius={[0, 4, 4, 0]}>
                {returnData.map((entry) => (
                  <Cell key={entry.type} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </DashboardPanel>
      </ChartsRowHalves>

      {/* 2b — Grouped bar: Invested vs Current */}
      <ChartsRow>
        <DashboardPanel>
          <SectionTitle>Invested vs Current Capital by Type</SectionTitle>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={barData}
              margin={{ top: 20, right: 30, left: 10, bottom: 8 }}
            >
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                stroke={gridColor}
              />
              <XAxis
                dataKey="type"
                tick={{ fill: tickColor, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: tickColor, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => "₹" + (v / 1000).toFixed(0) + "k"}
              />
              <Tooltip content={<CustomBarTooltip />} />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: "0.75rem", color: tickColor }}
              />
              <Bar dataKey="Invested" fill="#4E9AF1" radius={[4, 4, 0, 0]}>
                <LabelList
                  dataKey="delta"
                  position="top"
                  formatter={(v: unknown) => {
                    const n = Number(v);
                    return n >= 0
                      ? `+${(n / 1000).toFixed(1)}k`
                      : `${(n / 1000).toFixed(1)}k`;
                  }}
                  style={{
                    fill: tickColor,
                    fontSize: "0.68rem",
                    fontFamily: "monospace",
                  }}
                />
              </Bar>
              <Bar dataKey="Current" fill="#00C896" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </DashboardPanel>
      </ChartsRow>
    </>
  );
};

export default InstrumentCharts;
