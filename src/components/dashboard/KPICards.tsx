import {
  KPIGrid,
  KPICard,
  KPILabel,
  KPIValue,
  KPISubtext,
  SkeletonBlock,
} from "../../pages/Dashboard.styled";
import { fmtCurrency, fmtPct, type PortfolioKPIs } from "../../utils/dashboard";

interface Props {
  kpis: PortfolioKPIs;
  loading: boolean;
}

const KPICards = ({ kpis, loading }: Props) => {
  const { totalInvested, currentValue, totalPnL, overallReturnPct } = kpis;

  if (loading) {
    return (
      <KPIGrid>
        {[0, 1, 2, 3].map((i) => (
          <KPICard key={i}>
            <SkeletonBlock $height="0.75rem" $width="60%" />
            <div style={{ marginTop: "0.75rem" }} />
            <SkeletonBlock $height="2rem" $width="80%" />
          </KPICard>
        ))}
      </KPIGrid>
    );
  }

  const cards = [
    {
      label: "Total Invested",
      value: fmtCurrency(totalInvested),
      sub: null,
      positive: undefined,
      negative: undefined,
    },
    {
      label: "Current Value",
      value: fmtCurrency(currentValue),
      sub: null,
      positive: undefined,
      negative: undefined,
    },
    {
      label: "Total P&L",
      value: fmtCurrency(Math.abs(totalPnL)),
      sub: `${totalPnL >= 0 ? "+" : "-"}${fmtCurrency(Math.abs(totalPnL))}`,
      positive: totalPnL > 0 ? true : undefined,
      negative: totalPnL < 0 ? true : undefined,
    },
    {
      label: "Overall Return",
      value: fmtPct(overallReturnPct),
      sub: null,
      positive: overallReturnPct > 0 ? true : undefined,
      negative: overallReturnPct < 0 ? true : undefined,
    },
  ];

  return (
    <KPIGrid>
      {cards.map((c) => (
        <KPICard key={c.label}>
          <KPILabel>{c.label}</KPILabel>
          <KPIValue $positive={c.positive} $negative={c.negative}>
            {c.value}
          </KPIValue>
          {c.sub && <KPISubtext>{c.sub}</KPISubtext>}
        </KPICard>
      ))}
    </KPIGrid>
  );
};

export default KPICards;
