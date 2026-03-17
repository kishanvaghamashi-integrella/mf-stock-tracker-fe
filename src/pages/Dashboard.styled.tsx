import styled, { keyframes } from "styled-components";

// ─── Layout ────────────────────────────────────────────────────────────────────

export const DashboardWrapper = styled.div`
  min-height: 100vh;
  padding: 2rem;
  background: var(--bg-page);

  @media (max-width: 640px) {
    padding: 1rem;
  }
`;

export const DashboardHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

export const DashboardTitle = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--text-default);

  @media (max-width: 640px) {
    font-size: 1.5rem;
  }
`;

export const DashboardPanel = styled.div`
  background: var(--bg-surface);
  border-radius: 0.75rem;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-default);
  padding: 1.5rem;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
`;

export const SectionTitle = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-default);
  margin-bottom: 1.25rem;
  letter-spacing: 0.01em;
`;

// Alias kept for backward compat in existing Dashboard.tsx
export const Title = SectionTitle;

// ─── KPI Cards ─────────────────────────────────────────────────────────────────

export const KPIGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const KPICard = styled.div`
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: 0.75rem;
  padding: 1.25rem 1.5rem;
  box-shadow: var(--shadow-sm);
  transition: box-shadow 0.15s ease;

  &:hover {
    box-shadow: var(--shadow-md);
  }
`;

export const KPILabel = styled.p`
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
`;

export const KPIValue = styled.p<{ $positive?: boolean; $negative?: boolean }>`
  font-size: 1.5rem;
  font-weight: 700;
  font-family: "JetBrains Mono", "IBM Plex Mono", "Fira Code", monospace;
  color: ${({ $positive, $negative }) =>
    $positive ? "#00C896" : $negative ? "#FF4D6D" : "var(--text-default)"};
  line-height: 1.2;

  @media (max-width: 640px) {
    font-size: 1.25rem;
  }
`;

export const KPISubtext = styled.p`
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 0.375rem;
`;

// ─── Chart section grid ────────────────────────────────────────────────────────

export const ChartsRow = styled.div`
  display: grid;
  gap: 1rem;
  margin-bottom: 1rem;
`;

export const ChartsRowHalves = styled(ChartsRow)`
  grid-template-columns: 1fr 1fr;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const ChartsRowThirds = styled(ChartsRow)`
  grid-template-columns: 1fr 1fr 1fr;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr 1fr;
  }
  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

// ─── Section divider ──────────────────────────────────────────────────────────

export const SectionDivider = styled.div`
  margin: 2rem 0 1rem;
`;

export const SectionHeading = styled.h2`
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-default);
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-default);
  letter-spacing: 0.01em;
`;

// ─── Filter bar ───────────────────────────────────────────────────────────────

export const FilterBar = styled.div`
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: 0.75rem;
  padding: 1rem 1.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  box-shadow: var(--shadow-sm);
`;

export const FilterLabel = styled.label`
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
  white-space: nowrap;
`;

export const FilterInput = styled.input`
  padding: 0.375rem 0.75rem;
  border: 1px solid var(--border-default);
  border-radius: 0.375rem;
  background: var(--bg-subtle);
  color: var(--text-default);
  font-size: 0.875rem;
  min-height: 36px;
  outline: none;
  transition: border-color 0.15s;

  &:focus {
    border-color: var(--accent-primary);
  }
`;

export const FilterSelect = styled.select`
  padding: 0.375rem 0.625rem;
  border: 1px solid var(--border-default);
  border-radius: 0.375rem;
  background: var(--bg-subtle);
  color: var(--text-default);
  font-size: 0.875rem;
  min-height: 36px;
  outline: none;
  cursor: pointer;
  transition: border-color 0.15s;

  &:focus {
    border-color: var(--accent-primary);
  }
`;

export const ToggleGroup = styled.div`
  display: flex;
  border: 1px solid var(--border-default);
  border-radius: 0.375rem;
  overflow: hidden;
`;

export const ToggleButton = styled.button<{ $active: boolean }>`
  padding: 0.375rem 0.875rem;
  font-size: 0.75rem;
  font-weight: 600;
  border: none;
  border-right: 1px solid var(--border-default);
  cursor: pointer;
  min-height: 36px;
  background: ${({ $active }) =>
    $active ? "var(--accent-primary)" : "var(--bg-subtle)"};
  color: ${({ $active }) =>
    $active ? "var(--accent-text, #fff)" : "var(--text-muted)"};
  transition:
    background 0.15s,
    color 0.15s;

  &:last-child {
    border-right: none;
  }

  &:hover {
    background: ${({ $active }) =>
      $active ? "var(--accent-hover)" : "var(--border-default)"};
  }
`;

export const MultiSelectTag = styled.button<{
  $selected: boolean;
  $color?: string;
}>`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.72rem;
  font-weight: 600;
  border: 1px solid ${({ $color }) => $color ?? "var(--border-default)"};
  cursor: pointer;
  min-height: 30px;
  background: ${({ $selected, $color }) =>
    $selected ? ($color ?? "var(--accent-primary)") : "transparent"};
  color: ${({ $selected, $color }) =>
    $selected ? "#fff" : ($color ?? "var(--text-muted)")};
  transition: all 0.15s;

  &:hover {
    opacity: 0.85;
  }
`;

// ─── Breadcrumb ───────────────────────────────────────────────────────────────

export const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-bottom: 0.75rem;
`;

export const BreadcrumbLink = styled.button`
  background: none;
  border: none;
  color: var(--accent-primary);
  cursor: pointer;
  font-size: 0.8rem;
  padding: 0;
  text-decoration: underline;

  &:hover {
    color: var(--accent-hover);
  }
`;

// ─── Side panel (transaction drill-down) ─────────────────────────────────────

export const SidePanelOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 50;
`;

export const SidePanel = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  width: min(520px, 95vw);
  background: var(--bg-surface);
  border-left: 1px solid var(--border-default);
  box-shadow: var(--shadow-lg);
  z-index: 51;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const SidePanelHeader = styled.div`
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border-default);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const SidePanelTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-default);
`;

export const SidePanelClose = styled.button`
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.25rem;
  min-width: 44px;
  min-height: 44px;

  &:hover {
    background: var(--bg-subtle);
    color: var(--text-default);
  }
`;

export const SidePanelBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.25rem 1.5rem;
`;

// ─── Mono value ───────────────────────────────────────────────────────────────

export const MonoValue = styled.span<{
  $positive?: boolean;
  $negative?: boolean;
}>`
  font-family: "JetBrains Mono", "IBM Plex Mono", monospace;
  font-size: 0.875rem;
  color: ${({ $positive, $negative }) =>
    $positive ? "#00C896" : $negative ? "#FF4D6D" : "inherit"};
`;

// ─── Skeleton loader ──────────────────────────────────────────────────────────

const shimmer = keyframes`
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`;

export const SkeletonBlock = styled.div<{ $height?: string; $width?: string }>`
  height: ${({ $height }) => $height ?? "1rem"};
  width: ${({ $width }) => $width ?? "100%"};
  border-radius: 0.375rem;
  background: linear-gradient(
    90deg,
    var(--bg-subtle) 25%,
    var(--border-default) 50%,
    var(--bg-subtle) 75%
  );
  background-size: 800px 100%;
  animation: ${shimmer} 1.5s infinite;
`;

// ─── Chart tooltip helper ─────────────────────────────────────────────────────

export const ChartTooltipWrapper = styled.div`
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: 0.5rem;
  padding: 0.625rem 0.875rem;
  box-shadow: var(--shadow-md);
  font-size: 0.8rem;
  color: var(--text-default);
  max-width: 220px;
`;

export const ChartTooltipLabel = styled.p`
  font-weight: 700;
  margin-bottom: 0.25rem;
  color: var(--text-subtle);
`;

export const ChartTooltipRow = styled.p<{ $color?: string }>`
  color: ${({ $color }) => $color ?? "var(--text-default)"};
  font-family: "JetBrains Mono", monospace;
  font-size: 0.78rem;
  margin: 0.1rem 0;
`;

// ─── Empty state ──────────────────────────────────────────────────────────────

export const EmptyChart = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: var(--text-muted);
  font-size: 0.875rem;
`;

// ─── Table (for side panel) ───────────────────────────────────────────────────

export const MiniTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8rem;
`;

export const MiniTh = styled.th`
  text-align: left;
  padding: 0.5rem 0.75rem;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
  border-bottom: 1px solid var(--border-default);
  white-space: nowrap;
`;

export const MiniTd = styled.td`
  padding: 0.625rem 0.75rem;
  color: var(--text-default);
  border-bottom: 1px solid var(--border-default);
  white-space: nowrap;

  &:last-child {
    border-bottom: none;
  }
`;

export const BadgeTxn = styled.span<{ $type: string }>`
  display: inline-flex;
  align-items: center;
  padding: 0.15rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  background: ${({ $type }) =>
    $type === "BUY"
      ? "color-mix(in srgb, #00C896 18%, transparent)"
      : "color-mix(in srgb, #FF4D6D 18%, transparent)"};
  color: ${({ $type }) => ($type === "BUY" ? "#00C896" : "#FF4D6D")};
`;
