export interface User {
  id?: number;
  username: string;
  password: string;
  organizationId?: number;
  branchId?: number;
  roleId: number;
  status: boolean;
  createdAt?: string;
  updatedAt?: string;
}
