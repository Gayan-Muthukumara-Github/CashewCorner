import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_CONFIG } from '../config/api.config';
import {
  CreatePayrollRequest,
  PayrollResponse,
} from '../models/payroll.models';

@Injectable({
  providedIn: 'root',
})
export class PayrollService {
  private readonly payrollsUrl = `${API_CONFIG.baseUrl}/payrolls`;
  private readonly employeesUrl = `${API_CONFIG.baseUrl}/employees`;

  constructor(private http: HttpClient) {}

  generatePayroll(payload: CreatePayrollRequest): Observable<PayrollResponse> {
    return this.http.post<PayrollResponse>(this.payrollsUrl, payload);
  }

  getAllPayrolls(): Observable<PayrollResponse[]> {
    return this.http.get<PayrollResponse[]>(this.payrollsUrl);
  }

  getPayrollById(payrollId: number): Observable<PayrollResponse> {
    return this.http.get<PayrollResponse>(`${this.payrollsUrl}/${payrollId}`);
  }

  getEmployeePayrolls(employeeId: number): Observable<PayrollResponse[]> {
    return this.http.get<PayrollResponse[]>(`${this.employeesUrl}/${employeeId}/payrolls`);
  }

  getUnpaidPayrolls(): Observable<PayrollResponse[]> {
    return this.http.get<PayrollResponse[]>(`${this.payrollsUrl}/unpaid`);
  }
}
