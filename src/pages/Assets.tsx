import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import {
  PageWrapper,
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
  BadgeType,
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
import { api } from "../utils/api";
import { showToast } from "../utils/toast";
import type { Asset, CreateAssetRequest } from "../types";

const INSTRUMENT_TYPES = ["stock", "mutual_fund"];

const PAGE_SIZE = 20;

const emptyForm: CreateAssetRequest = {
  symbol: "",
  name: "",
  instrument_type: "",
  isin: "",
  exchange: "",
  currency: "",
  external_platform_id: "",
};

const Assets = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Create / Edit dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [formData, setFormData] = useState<CreateAssetRequest>(emptyForm);
  const [formLoading, setFormLoading] = useState(false);

  // Delete confirmation dialog
  const [deleteTarget, setDeleteTarget] = useState<Asset | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchAssets = useCallback(async (currentOffset: number) => {
    setIsLoading(true);
    try {
      const res = await api.get<Asset[]>(
        `/assets/?limit=${PAGE_SIZE}&offset=${currentOffset}`,
      );
      setAssets(res ?? []);
      setTotal(res.length ?? 0);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load assets";
      showToast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssets(offset);
  }, [fetchAssets, offset]);

  const openCreate = () => {
    setEditingAsset(null);
    setFormData(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (asset: Asset) => {
    setEditingAsset(asset);
    setFormData({
      symbol: asset.symbol,
      name: asset.name,
      instrument_type: asset.instrument_type,
      isin: asset.isin,
      exchange: asset.exchange,
      currency: asset.currency,
      external_platform_id: asset.external_platform_id,
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingAsset(null);
    setFormData(emptyForm);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (editingAsset) {
        const updatePayload = Object.fromEntries(
          Object.entries(formData).filter(([, v]) => v !== ""),
        );
        await api.put(`/assets/${editingAsset.id}`, updatePayload);
        showToast.success("Asset updated successfully");
      } else {
        await api.post(`/assets/`, formData);
        showToast.success("Asset created successfully");
      }
      closeDialog();
      fetchAssets(offset);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Operation failed";
      showToast.error(message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/assets/${deleteTarget.id}`);
      showToast.success("Asset deleted");
      setDeleteTarget(null);
      const newOffset =
        assets.length === 1 && offset > 0 ? offset - PAGE_SIZE : offset;
      if (newOffset !== offset) {
        setOffset(newOffset);
      } else {
        fetchAssets(offset);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete asset";
      showToast.error(message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const currentPage = Math.floor(offset / PAGE_SIZE) + 1;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const startItem = total === 0 ? 0 : offset + 1;
  const endItem = Math.min(offset + PAGE_SIZE, total);

  return (
    <PageWrapper>
      <PageHeader>
        <div>
          <PageTitle>Assets</PageTitle>
          <p
            style={{
              color: "var(--text-muted)",
              marginTop: "0.25rem",
              fontSize: "0.875rem",
            }}
          >
            Manage your stocks, mutual funds, and other instruments
          </p>
        </div>
        <AddButton onClick={openCreate}>
          <Plus size={16} />
          Add Asset
        </AddButton>
      </PageHeader>

      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>Symbol</Th>
              <Th>Name</Th>
              <Th>Type</Th>
              <Th>ISIN</Th>
              <Th>Exchange</Th>
              <Th>Currency</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7}>
                  <EmptyState>Loading assets…</EmptyState>
                </td>
              </tr>
            ) : assets.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <EmptyState>
                    No assets found. Add your first asset to get started.
                  </EmptyState>
                </td>
              </tr>
            ) : (
              assets.map((asset) => (
                <Tr key={asset.id}>
                  <Td>
                    <strong>{asset.symbol}</strong>
                  </Td>
                  <Td>{asset.name}</Td>
                  <Td>
                    <BadgeType $type={asset.instrument_type}>
                      {asset.instrument_type.replace(/_/g, " ")}
                    </BadgeType>
                  </Td>
                  <Td>{asset.isin}</Td>
                  <Td>{asset.exchange}</Td>
                  <Td>{asset.currency || "—"}</Td>
                  <Td>
                    <div style={{ display: "flex", gap: "0.375rem" }}>
                      <ActionButton
                        $variant="edit"
                        onClick={() => openEdit(asset)}
                        title="Edit asset"
                      >
                        <Pencil size={15} />
                      </ActionButton>
                      <ActionButton
                        $variant="delete"
                        onClick={() => setDeleteTarget(asset)}
                        title="Delete asset"
                      >
                        <Trash2 size={15} />
                      </ActionButton>
                    </div>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>

      {total > 0 && (
        <PaginationWrapper>
          <PageInfo>
            {startItem}–{endItem} of {total}
          </PageInfo>
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            <PaginationButton
              disabled={offset === 0}
              onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}
            >
              Previous
            </PaginationButton>
            <span
              style={{
                fontSize: "0.875rem",
                color: "var(--text-muted)",
                whiteSpace: "nowrap",
              }}
            >
              Page {currentPage} of {totalPages}
            </span>
            <PaginationButton
              disabled={offset + PAGE_SIZE >= total}
              onClick={() => setOffset(offset + PAGE_SIZE)}
            >
              Next
            </PaginationButton>
          </div>
        </PaginationWrapper>
      )}

      {/* ── Create / Edit Dialog ─────────────────────── */}
      {dialogOpen && (
        <DialogOverlay onClick={closeDialog}>
          <DialogPanel onClick={(e) => e.stopPropagation()}>
            <DialogHeader>
              <DialogTitle>
                {editingAsset ? "Edit Asset" : "Add Asset"}
              </DialogTitle>
              <DialogClose onClick={closeDialog} aria-label="Close dialog">
                <X size={20} />
              </DialogClose>
            </DialogHeader>

            <form onSubmit={handleSubmit}>
              <FormGrid>
                <FormGroup>
                  <FormLabel htmlFor="symbol">
                    Symbol <span style={{ color: "#ef4444" }}>*</span>
                  </FormLabel>
                  <FormInput
                    id="symbol"
                    name="symbol"
                    required
                    placeholder="e.g. RELIANCE"
                    value={formData.symbol}
                    onChange={handleFormChange}
                  />
                </FormGroup>

                <FormGroup>
                  <FormLabel htmlFor="instrument_type">
                    Type <span style={{ color: "#ef4444" }}>*</span>
                  </FormLabel>
                  <FormSelect
                    id="instrument_type"
                    name="instrument_type"
                    required
                    value={formData.instrument_type}
                    onChange={handleFormChange}
                  >
                    <option value="">Select type…</option>
                    {INSTRUMENT_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t.replace(/_/g, " ")}
                      </option>
                    ))}
                  </FormSelect>
                </FormGroup>

                <FormGroupFull>
                  <FormLabel htmlFor="name">
                    Name <span style={{ color: "#ef4444" }}>*</span>
                  </FormLabel>
                  <FormInput
                    id="name"
                    name="name"
                    required
                    placeholder="e.g. Reliance Industries Ltd"
                    value={formData.name}
                    onChange={handleFormChange}
                  />
                </FormGroupFull>

                <FormGroup>
                  <FormLabel htmlFor="isin">
                    ISIN <span style={{ color: "#ef4444" }}>*</span>
                  </FormLabel>
                  <FormInput
                    id="isin"
                    name="isin"
                    required
                    placeholder="e.g. INE002A01018"
                    value={formData.isin}
                    onChange={handleFormChange}
                  />
                </FormGroup>

                <FormGroup>
                  <FormLabel htmlFor="exchange">
                    Exchange <span style={{ color: "#ef4444" }}>*</span>
                  </FormLabel>
                  <FormInput
                    id="exchange"
                    name="exchange"
                    required
                    placeholder="e.g. NSE"
                    value={formData.exchange}
                    onChange={handleFormChange}
                  />
                </FormGroup>

                <FormGroup>
                  <FormLabel htmlFor="currency">Currency</FormLabel>
                  <FormInput
                    id="currency"
                    name="currency"
                    placeholder="e.g. INR"
                    value={formData.currency}
                    onChange={handleFormChange}
                  />
                </FormGroup>

                <FormGroup>
                  <FormLabel htmlFor="external_platform_id">
                    External Platform ID
                  </FormLabel>
                  <FormInput
                    id="external_platform_id"
                    name="external_platform_id"
                    placeholder="e.g. platform-123"
                    value={formData.external_platform_id}
                    onChange={handleFormChange}
                  />
                </FormGroup>
              </FormGrid>

              <ButtonRow>
                <CancelButton type="button" onClick={closeDialog}>
                  Cancel
                </CancelButton>
                <SubmitButton type="submit" disabled={formLoading}>
                  {formLoading
                    ? editingAsset
                      ? "Updating…"
                      : "Creating…"
                    : editingAsset
                      ? "Update Asset"
                      : "Create Asset"}
                </SubmitButton>
              </ButtonRow>
            </form>
          </DialogPanel>
        </DialogOverlay>
      )}

      {/* ── Delete Confirmation Dialog ───────────────── */}
      {deleteTarget && (
        <DialogOverlay onClick={() => setDeleteTarget(null)}>
          <DialogPanel $compact onClick={(e) => e.stopPropagation()}>
            <DialogHeader>
              <DialogTitle>Delete Asset</DialogTitle>
              <DialogClose
                onClick={() => setDeleteTarget(null)}
                aria-label="Close dialog"
              >
                <X size={20} />
              </DialogClose>
            </DialogHeader>

            <p
              style={{
                color: "var(--text-subtle)",
                fontSize: "0.9rem",
                lineHeight: "1.6",
                marginBottom: "1.5rem",
              }}
            >
              Are you sure you want to delete{" "}
              <strong style={{ color: "var(--text-default)" }}>
                {deleteTarget.name} ({deleteTarget.symbol})
              </strong>
              ? This action cannot be undone.
            </p>

            <ButtonRow>
              <CancelButton type="button" onClick={() => setDeleteTarget(null)}>
                Cancel
              </CancelButton>
              <DeleteConfirmButton
                onClick={handleDelete}
                disabled={deleteLoading}
              >
                {deleteLoading ? "Deleting…" : "Delete"}
              </DeleteConfirmButton>
            </ButtonRow>
          </DialogPanel>
        </DialogOverlay>
      )}
    </PageWrapper>
  );
};

export default Assets;
