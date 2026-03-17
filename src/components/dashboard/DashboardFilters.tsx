import {
  FilterBar,
  FilterLabel,
  FilterInput,
  MultiSelectTag,
} from "../../pages/Dashboard.styled";
import { getInstrumentColor } from "../../utils/dashboard";

interface Props {
  instrumentTypes: string[];
  selectedTypes: string[];
  onTypeToggle: (type: string) => void;
  dateFrom: string;
  dateTo: string;
  onDateFromChange: (v: string) => void;
  onDateToChange: (v: string) => void;
  assetSearch: string;
  onAssetSearchChange: (v: string) => void;
}

const DashboardFilters = ({
  instrumentTypes,
  selectedTypes,
  onTypeToggle,
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  assetSearch,
  onAssetSearchChange,
}: Props) => {
  return (
    <FilterBar>
      {/* Date range */}
      <div className="flex items-center gap-2 flex-wrap">
        <FilterLabel>From</FilterLabel>
        <FilterInput
          type="date"
          value={dateFrom}
          onChange={(e) => onDateFromChange(e.target.value)}
          aria-label="Start date"
        />
        <FilterLabel>To</FilterLabel>
        <FilterInput
          type="date"
          value={dateTo}
          onChange={(e) => onDateToChange(e.target.value)}
          aria-label="End date"
        />
      </div>

      {/* Divider */}
      <div
        style={{
          width: 1,
          alignSelf: "stretch",
          background: "var(--border-default)",
        }}
      />

      {/* Instrument type multi-select */}
      <div className="flex items-center gap-2 flex-wrap">
        <FilterLabel>Type</FilterLabel>
        {instrumentTypes.map((type) => {
          const color = getInstrumentColor(type);
          return (
            <MultiSelectTag
              key={type}
              $selected={selectedTypes.includes(type)}
              $color={color}
              onClick={() => onTypeToggle(type)}
            >
              {type}
            </MultiSelectTag>
          );
        })}
      </div>

      {/* Divider */}
      <div
        style={{
          width: 1,
          alignSelf: "stretch",
          background: "var(--border-default)",
        }}
      />

      {/* Asset search */}
      <div className="flex items-center gap-2">
        <FilterLabel>Search</FilterLabel>
        <FilterInput
          type="text"
          placeholder="Asset name…"
          value={assetSearch}
          onChange={(e) => onAssetSearchChange(e.target.value)}
          style={{ minWidth: 140 }}
          aria-label="Asset search"
        />
      </div>
    </FilterBar>
  );
};

export default DashboardFilters;
