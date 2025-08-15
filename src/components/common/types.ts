import { ReactNode } from "react";

export interface Identifiable {
  id?: string | number;
  _id?: string | number;
}

export interface Column<T, K extends keyof T = keyof T> {
  key: K;
  label: string;
  sortable?: boolean;
  render?: (value: T[K], item: T) => ReactNode;
  minWidth?: number;
  maxWidth?: number;
  width?: number;
}

export interface TableAction<T> {
  label: string;
  icon?: ReactNode;
  onClick: (item: T) => void;
  variant?: "primary" | "secondary" | "danger";
  disabled?: (item: T) => boolean;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  startIndex: number;
  endIndex: number;
}

export interface GenericTableProps<T extends Identifiable> {
  data: T[];
  columns: Column<T>[];
  actions?: TableAction<T>[];
  itemsPerPage?: number;
  selectable?: boolean;
  onSelectionChange?: (selectedItems: T[]) => void;
  onView?: (item: T) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  tableWidth?: string | number;
  minColumnWidth?: number;
  defaultColumnWidth?: number;
  numberColumnWidth?: number;
}

export interface TableState<T> {
  currentPage: number;
  selectedItems: Set<string>;
  sortColumn: keyof T | null;
  sortDirection: "asc" | "desc";
}

export interface EnhancedTableState<T> extends TableState<T> {
  columnFilters: Record<string, string>;
  showFilters: boolean;
  columnWidths: Record<string, number>;
}

export interface EnhancedColumn<T, K extends keyof T = keyof T> extends Column<T, K> {
  minWidth?: number;
  maxWidth?: number;
  width?: number;
  resizable?: boolean;
}

export interface EnhancedGenericTableProps<T extends Identifiable> extends Omit<GenericTableProps<T>, "columns"> {
  columns: EnhancedColumn<T>[];
  tableWidth?: string | number;
  minColumnWidth?: number;
  defaultColumnWidth?: number;
  numberColumnWidth?: number;
  enableColumnFilters?: boolean;
  enableColumnResize?: boolean;
  persistColumnWidths?: boolean;
  columnWidthStorageKey?: string;
}

export interface ColumnResizeEvent {
  columnKey: string;
  oldWidth: number;
  newWidth: number;
  minWidth: number;
  maxWidth?: number;
}

export interface ColumnFilterEvent {
  columnKey: string;
  filterValue: string;
  previousValue: string;
}

export interface SelectionChangeEvent<T> {
  selectedItems: T[];
  selectedKeys: Set<string>;
  isSelectAll: boolean;
  item?: T;
}

export interface TableConfig {
  animations?: {
    enabled: boolean;
    duration: number;
  };
  virtualization?: {
    enabled: boolean;
    itemHeight: number;
    overscan: number;
  };
  keyboard?: {
    enabled: boolean;
    shortcuts: Record<string, string>;
  };
  accessibility?: {
    announcements: boolean;
    focusManagement: boolean;
  };
}
