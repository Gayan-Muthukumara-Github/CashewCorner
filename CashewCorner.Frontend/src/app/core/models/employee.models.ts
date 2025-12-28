export interface CreateEmployeeRequest {
  employeeCode: string;
  firstName: string;
  lastName: string;
  designation: string;
  department: string;
  phone: string;
  email: string;
  hireDate: string;
  salaryBase: number;
}

export interface UpdateEmployeeRequest {
  firstName?: string;
  lastName?: string;
  designation?: string;
  department?: string;
  phone?: string;
  email?: string;
  hireDate?: string;
  salaryBase?: number;
}

export interface EmployeeResponse {
  employeeId: number;
  employeeCode: string;
  firstName: string;
  lastName: string;
  fullName: string;
  designation: string;
  department: string;
  phone: string;
  email: string;
  hireDate: string;
  salaryBase: number;
  createdAt: string;
  updatedAt: string;
}
