export type Currency = "USD" | "NPR" | "EUR" | "INR";
export type PayrollStatus = "PENDING" | "APPROVED" | "REJECTED" | "PROCESSED";

export interface Payroll {
  id: number;
  createdAt: string;
  updatedAt: string;

  payPeriodStart: string;
  payPeriodEnd: string;
  paymentDate: string;

  basicSalary: number;
  housingAllowance?: number;
  transportAllowance?: number;
  bonus?: number;
  overtimePay?: number;
  tax?: number;
  loanDeduction?: number;
  absenceDeduction?: number;
  otherDeductions?: number;

  netSalary: number;
  currency: Currency;

  remarks?: string;
  employeeId: number;
  status?: PayrollStatus;
  processedById?: number;
}

// DTO (payload sent to backend when creating/updating)
export interface PayrollDto {
  payPeriodStart: string;
  payPeriodEnd: string;
  paymentDate: string;

  basicSalary: number;
  housingAllowance?: number;
  transportAllowance?: number;
  bonus?: number;
  overtimePay?: number;
  tax?: number;
  loanDeduction?: number;
  absenceDeduction?: number;
  otherDeductions?: number;

  netSalary: number;
  currency: Currency;

  remarks?: string;
  employeeId: number;
  status?: PayrollStatus;
  processedById?: number;
}
