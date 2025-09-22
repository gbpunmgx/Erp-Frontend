export interface User {
  id: number;
  createdAt: string;
  updatedAt: string;
  username: string;
  email: string;
  password: string;
  organizationId: number;
  branchId: number;
  roleId: number;
  employeeId: number | null;
  status: boolean;
}
