import { Title, DashboardPanel } from "./Dashboard.styled";
import ThemeToggle from "../components/ThemeToggle";
import { useTheme } from "../context/ThemeContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", value: 480 },
  { name: "Feb", value: 3000 },
  { name: "Mar", value: 2000 },
  { name: "Apr", value: 2780 },
  { name: "May", value: 1890 },
  { name: "Jun", value: 2390 },
  { name: "Jul", value: 3490 },
];

const Dashboard = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const chartColors = {
    stroke: isDark ? "#5b8cfa" : "#3b82f6",
    grid: isDark ? "#3d3a34" : "#e2e8f0",
    tick: isDark ? "#9c9589" : "#64748b",
    tooltipBg: isDark ? "#28251f" : "#ffffff",
    tooltipText: isDark ? "#f0ece4" : "#0f172a",
  };

  return (
    <div
      className="min-h-screen p-8"
      style={{ backgroundColor: "var(--bg-page)" }}
    >
      <header className="mb-8 flex items-start justify-between">
        <div>
          <h1
            className="text-3xl font-bold"
            style={{ color: "var(--text-default)" }}
          >
            Investment Portfolio
          </h1>
          <p className="mt-2" style={{ color: "var(--text-muted)" }}>
            Welcome to your portfolio tracker.
          </p>
        </div>
        <ThemeToggle />
      </header>

      <DashboardPanel>
        <Title>Portfolio Performance</Title>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={chartColors.grid}
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: chartColors.tick }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: chartColors.tick }}
                dx={-10}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "0.5rem",
                  border: `1px solid ${isDark ? "#3d3a34" : "#e2e8f0"}`,
                  boxShadow: isDark
                    ? "0 10px 15px -3px rgb(0 0 0 / 0.4)"
                    : "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  backgroundColor: chartColors.tooltipBg,
                  color: chartColors.tooltipText,
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={chartColors.stroke}
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </DashboardPanel>
    </div>
  );
};

export default Dashboard;
