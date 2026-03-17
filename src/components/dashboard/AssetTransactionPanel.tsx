import { useEffect } from "react";
import { X } from "lucide-react";
import {
  SidePanelOverlay,
  SidePanel,
  SidePanelHeader,
  SidePanelTitle,
  SidePanelClose,
  SidePanelBody,
  MiniTable,
  MiniTh,
  MiniTd,
  BadgeTxn,
  MonoValue,
} from "../../pages/Dashboard.styled";
import type { Transaction } from "../../types";
import { fmtCurrency } from "../../utils/dashboard";

interface Props {
  assetName: string;
  transactions: Transaction[];
  onClose: () => void;
}

const fmt = (iso: string) => new Date(iso).toLocaleDateString("en-IN");

const AssetTransactionPanel = ({ assetName, transactions, onClose }: Props) => {
  const filtered = transactions
    .filter((t) => t.asset_name === assetName)
    .sort((a, b) => b.txn_date.localeCompare(a.txn_date));

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <>
      <SidePanelOverlay onClick={onClose} />
      <SidePanel
        role="dialog"
        aria-modal
        aria-label={`Transactions for ${assetName}`}
      >
        <SidePanelHeader>
          <SidePanelTitle>Transactions — {assetName}</SidePanelTitle>
          <SidePanelClose onClick={onClose} aria-label="Close panel">
            <X size={18} />
          </SidePanelClose>
        </SidePanelHeader>
        <SidePanelBody>
          {filtered.length === 0 ? (
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
              No transactions found for {assetName}.
            </p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <MiniTable>
                <thead>
                  <tr>
                    <MiniTh>Date</MiniTh>
                    <MiniTh>Type</MiniTh>
                    <MiniTh>Qty</MiniTh>
                    <MiniTh>Price</MiniTh>
                    <MiniTh>Total</MiniTh>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((t) => (
                    <tr key={t.id}>
                      <MiniTd>{fmt(t.txn_date)}</MiniTd>
                      <MiniTd>
                        <BadgeTxn $type={t.txn_type}>{t.txn_type}</BadgeTxn>
                      </MiniTd>
                      <MiniTd>
                        <MonoValue>{t.quantity}</MonoValue>
                      </MiniTd>
                      <MiniTd>
                        <MonoValue>{fmtCurrency(t.price)}</MonoValue>
                      </MiniTd>
                      <MiniTd>
                        <MonoValue
                          $positive={t.txn_type === "BUY"}
                          $negative={t.txn_type === "SELL"}
                        >
                          {fmtCurrency(t.price * t.quantity)}
                        </MonoValue>
                      </MiniTd>
                    </tr>
                  ))}
                </tbody>
              </MiniTable>
            </div>
          )}
        </SidePanelBody>
      </SidePanel>
    </>
  );
};

export default AssetTransactionPanel;
