// Re-export all shared styled components from Assets.styled.tsx
export {
  PageWrapper,
  BadgeType,
  PageHeader,
  PageTitle,
  AddButton,
  TableContainer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  ActionButton,
  EmptyState,
  PaginationWrapper,
  PaginationButton,
  PageInfo,
  DialogOverlay,
  DialogPanel,
  DialogHeader,
  DialogTitle,
  DialogClose,
  FormGrid,
  FormGroup,
  FormGroupFull,
  FormLabel,
  FormInput,
  FormSelect,
  ButtonRow,
  SubmitButton,
  CancelButton,
  DeleteConfirmButton,
} from "./Assets.styled";

import styled from "styled-components";

export const BadgeTxnType = styled.span<{ $type: string }>`
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
      case "BUY":
        return "color-mix(in srgb, #10b981 15%, transparent)";
      case "SELL":
        return "color-mix(in srgb, #ef4444 15%, transparent)";
      default:
        return "var(--bg-subtle)";
    }
  }};
  color: ${({ $type }) => {
    switch ($type?.toUpperCase()) {
      case "BUY":
        return "#059669";
      case "SELL":
        return "#dc2626";
      default:
        return "var(--text-muted)";
    }
  }};
`;
