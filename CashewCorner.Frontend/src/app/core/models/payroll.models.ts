export interface CreatePayrollRequest {
  employeeId: number;
  periodStart: string;
  periodEnd: string;
  grossPay: number;
  deductions: number;
  netPay: number; // This will be calculated on the backend
  paymentDate: string;
  paymentMethod: string;
}

export interface PayrollResponse {
  payrollId: number;
  employeeId: number;
  employeeName: string;
  periodStart: string;
  periodEnd: string;
  grossPay: number;
  deductions: number;
  netPay: number;
  paymentDate: string;
  paymentMethod: string;
  isPaid: boolean;
  createdAt: string;
  updatedAt: string;
}
