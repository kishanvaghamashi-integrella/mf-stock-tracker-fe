import styled from "styled-components";

export const PageWrapper = styled.div`
  min-height: 100vh;
  padding: 2rem;
  background: var(--bg-page);

  @media (max-width: 640px) {
    padding: 1rem;
  }
`;

export const PageHeader = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

export const PageTitle = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--text-default);

  @media (max-width: 640px) {
    font-size: 1.5rem;
  }
`;

export const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  min-height: 44px;
  background: var(--accent-primary);
  color: var(--accent-text, #fff);
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s ease;

  &:hover {
    background: var(--accent-hover);
  }
`;

export const TableContainer = styled.div`
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: 0.75rem;
  overflow: hidden;
  overflow-x: auto;
  transition:
    background 0.2s ease,
    border-color 0.2s ease;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 640px;
`;

export const Thead = styled.thead`
  background: var(--bg-subtle);
  border-bottom: 1px solid var(--border-default);
`;

export const Tbody = styled.tbody``;

export const Tr = styled.tr`
  border-bottom: 1px solid var(--border-default);
  transition: background 0.1s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: var(--bg-subtle);
  }
`;

export const Th = styled.th`
  text-align: left;
  padding: 0.75rem 1rem;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
  white-space: nowrap;
`;

export const Td = styled.td`
  padding: 0.875rem 1rem;
  font-size: 0.875rem;
  color: var(--text-default);
  white-space: nowrap;
`;

export const BadgeType = styled.span<{ $type: string }>`
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.625rem;
  border-radius: 9999px;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  background: ${({ $type }) => {
    switch ($type?.toUpperCase()) {
      case "STOCK":
        return "color-mix(in srgb, #3b82f6 15%, transparent)";
      case "MUTUAL_FUND":
        return "color-mix(in srgb, #10b981 15%, transparent)";
      case "ETF":
        return "color-mix(in srgb, #f59e0b 15%, transparent)";
      case "BOND":
        return "color-mix(in srgb, #8b5cf6 15%, transparent)";
      default:
        return "var(--bg-subtle)";
    }
  }};
  color: ${({ $type }) => {
    switch ($type?.toUpperCase()) {
      case "STOCK":
        return "#2563eb";
      case "MUTUAL_FUND":
        return "#059669";
      case "ETF":
        return "#d97706";
      case "BOND":
        return "#7c3aed";
      default:
        return "var(--text-muted)";
    }
  }};
`;

export const ActionButton = styled.button<{ $variant: "edit" | "delete" }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  background: transparent;
  color: ${({ $variant }) =>
    $variant === "delete" ? "#ef4444" : "var(--text-muted)"};
  transition:
    background 0.15s ease,
    color 0.15s ease;

  &:hover {
    background: ${({ $variant }) =>
      $variant === "delete"
        ? "color-mix(in srgb, #ef4444 12%, transparent)"
        : "var(--bg-subtle)"};
    color: ${({ $variant }) =>
      $variant === "delete" ? "#ef4444" : "var(--text-default)"};
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text-muted);
  font-size: 0.9rem;
`;

export const PaginationWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
  padding: 0.25rem 0;
`;

export const PageInfo = styled.span`
  font-size: 0.875rem;
  color: var(--text-muted);
`;

export const PaginationButton = styled.button`
  padding: 0.5rem 1rem;
  min-height: 36px;
  border: 1px solid var(--border-default);
  border-radius: 0.5rem;
  background: var(--bg-surface);
  color: var(--text-default);
  font-size: 0.875rem;
  cursor: pointer;
  transition:
    background 0.15s ease,
    border-color 0.15s ease;

  &:hover:not(:disabled) {
    background: var(--bg-subtle);
    border-color: var(--border-strong);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

/* ── Dialog ───────────────────────────────────────── */

export const DialogOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 1rem;
`;

export const DialogPanel = styled.div<{ $compact?: boolean }>`
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: 0.75rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
  padding: 1.5rem;
  width: 100%;
  max-width: ${({ $compact }) => ($compact ? "28rem" : "38rem")};
  max-height: 90vh;
  overflow-y: auto;
  transition:
    background 0.2s ease,
    border-color 0.2s ease;
`;

export const DialogHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

export const DialogTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-default);
`;

export const DialogClose = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 0.5rem;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  transition:
    background 0.15s ease,
    color 0.15s ease;

  &:hover {
    background: var(--bg-subtle);
    color: var(--text-default);
  }
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const FormGroupFull = styled(FormGroup)`
  grid-column: 1 / -1;
`;

export const FormLabel = styled.label`
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--text-subtle);
`;

export const FormInput = styled.input`
  box-sizing: border-box;
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--border-default);
  border-radius: 0.5rem;
  background: var(--bg-subtle);
  color: var(--text-default);
  font-size: 0.875rem;
  outline: none;
  transition:
    border-color 0.2s,
    background 0.2s,
    box-shadow 0.2s;

  &::placeholder {
    color: var(--text-muted);
  }

  &:focus {
    border-color: var(--accent-primary);
    background: var(--bg-surface);
    box-shadow: 0 0 0 2px
      color-mix(in srgb, var(--accent-primary) 20%, transparent);
  }
`;

export const FormSelect = styled.select`
  box-sizing: border-box;
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--border-default);
  border-radius: 0.5rem;
  background: var(--bg-subtle);
  color: var(--text-default);
  font-size: 0.875rem;
  outline: none;
  cursor: pointer;
  transition:
    border-color 0.2s,
    background 0.2s,
    box-shadow 0.2s;

  &:focus {
    border-color: var(--accent-primary);
    background: var(--bg-surface);
    box-shadow: 0 0 0 2px
      color-mix(in srgb, var(--accent-primary) 20%, transparent);
  }
`;

export const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
`;

export const SubmitButton = styled.button`
  padding: 0.625rem 1.25rem;
  min-height: 44px;
  background: var(--accent-primary);
  color: var(--accent-text, #fff);
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: var(--accent-hover);
  }

  &:disabled {
    background: var(--accent-disabled);
    cursor: not-allowed;
  }
`;

export const CancelButton = styled.button`
  padding: 0.625rem 1.25rem;
  min-height: 44px;
  background: transparent;
  color: var(--text-subtle);
  border: 1px solid var(--border-default);
  border-radius: 0.5rem;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition:
    background 0.15s ease,
    border-color 0.15s ease;

  &:hover {
    background: var(--bg-subtle);
    border-color: var(--border-strong);
  }
`;

export const DeleteConfirmButton = styled.button`
  padding: 0.625rem 1.25rem;
  min-height: 44px;
  background: #ef4444;
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: #dc2626;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
