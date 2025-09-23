export interface ColumnDef<TData = any> {
  id: string;
  accessorKey: keyof TData;
  header: string;
  cell?: (value: any, row: TData) => React.ReactNode;
  filterable?: boolean;
  sortable?: boolean;
  visible?: boolean;
  options?: { value: string; label: string }[];
}

export interface GenericTableProps<TData = any> {
  data: TData[];
  columns: ColumnDef<TData>[];
  onSort?: (key: keyof TData) => void;
  loading?: boolean;
  onEdit?: (row: TData) => void;
  onDelete?: (row: TData) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}
