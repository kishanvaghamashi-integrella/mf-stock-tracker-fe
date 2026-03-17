import { useState, useEffect } from "react";
import {
  PageWrapper,
  PageHeader,
  PageTitle,
  TableContainer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  BadgeType,
  EmptyState,
} from "./Portfolio.styled";
import { api } from "../utils/api";
import { showToast } from "../utils/toast";
import type { Holding } from "../types";

const fmt = (n: number) =>
  n.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const Portfolio = () => {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchHoldings = async () => {
      setIsLoading(true);
      try {
        const data = await api.get<Holding[]>("/holdings");
        setHoldings(data);
      } catch (err: unknown) {
        showToast.error(
          err instanceof Error ? err.message : "Failed to load holdings",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchHoldings();
  }, []);

  return (
    <PageWrapper>
      <PageHeader>
        <PageTitle>Portfolio</PageTitle>
      </PageHeader>

      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>#</Th>
              <Th>Asset Name</Th>
              <Th>Type</Th>
              <Th>Quantity</Th>
              <Th>Avg. Price</Th>
              <Th>Invested</Th>
            </Tr>
          </Thead>
          <Tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    textAlign: "center",
                    padding: "3rem 1rem",
                    color: "var(--text-muted)",
                    fontSize: "0.9rem",
                  }}
                >
                  Loading…
                </td>
              </tr>
            ) : holdings.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <EmptyState>
                    No holdings found. Start by adding transactions.
                  </EmptyState>
                </td>
              </tr>
            ) : (
              holdings.map((holding, idx) => (
                <Tr key={holding.id}>
                  <Td style={{ color: "var(--text-muted)" }}>{idx + 1}</Td>
                  <Td style={{ fontWeight: 600 }}>{holding.asset_name}</Td>
                  <Td>
                    <BadgeType
                      $type={holding.asset_instrument_type.toUpperCase()}
                    >
                      {holding.asset_instrument_type.replace("_", " ")}
                    </BadgeType>
                  </Td>
                  <Td>{holding.quantity}</Td>
                  <Td>₹{fmt(holding.average_price)}</Td>
                  <Td>₹{fmt(holding.invested_price)}</Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </PageWrapper>
  );
};

export default Portfolio;
