export interface FiscalYear {
  id?: number;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  description: string;
  isCurrentYear: boolean;
  isClosed: boolean;
  organizationId: number;
  branchId: number;
}
