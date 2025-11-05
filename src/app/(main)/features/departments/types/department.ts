export interface Department {
  id?: number;
  name: string;
  description?: string;
  location?: string;
  organizationId: number;
  branchId: number;
  createdAt?: string;
  updatedAt?: string;
}
