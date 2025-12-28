import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_CONFIG } from '../config/api.config';
import {
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
  EmployeeResponse,
} from '../models/employee.models';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private readonly employeesUrl = `${API_CONFIG.baseUrl}/employees`;

  constructor(private http: HttpClient) {}

  getEmployees(): Observable<EmployeeResponse[]> {
    return this.http.get<EmployeeResponse[]>(this.employeesUrl);
  }

  getEmployeeById(employeeId: number): Observable<EmployeeResponse> {
    return this.http.get<EmployeeResponse>(`${this.employeesUrl}/${employeeId}`);
  }

  createEmployee(payload: CreateEmployeeRequest): Observable<EmployeeResponse> {
    return this.http.post<EmployeeResponse>(this.employeesUrl, payload);
  }

  updateEmployee(employeeId: number, payload: UpdateEmployeeRequest): Observable<EmployeeResponse> {
    return this.http.put<EmployeeResponse>(`${this.employeesUrl}/${employeeId}`, payload);
  }

  deleteEmployee(employeeId: number): Observable<void> {
    return this.http.delete<void>(`${this.employeesUrl}/${employeeId}`);
  }
}
