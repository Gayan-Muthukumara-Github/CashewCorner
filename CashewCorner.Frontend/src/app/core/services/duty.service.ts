import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  EmployeeDutyResponse,
  CreateEmployeeDutyRequest,
  UpdateDutyStatusRequest,
} from '../models/duty.models';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class DutyService {
  private apiUrl = `${API_CONFIG.baseUrl}/duties`;
  private employeesApiUrl = `${API_CONFIG.baseUrl}/employees`;

  constructor(private readonly http: HttpClient) {}

  /**
   * Assign a duty to an employee
   * POST /api/employees/{employeeId}/duties
   */
  assignDutyToEmployee(
    employeeId: number,
    request: CreateEmployeeDutyRequest
  ): Observable<EmployeeDutyResponse> {
    return this.http.post<EmployeeDutyResponse>(
      `${this.employeesApiUrl}/${employeeId}/duties`,
      request
    );
  }

  /**
   * Get all duties for an employee
   * GET /api/employees/{employeeId}/duties
   */
  getEmployeeDuties(employeeId: number): Observable<EmployeeDutyResponse[]> {
    return this.http.get<EmployeeDutyResponse[]>(
      `${this.employeesApiUrl}/${employeeId}/duties`
    );
  }

  /**
   * Update duty status
   * PATCH /api/duties/{dutyId}/status?status={status}
   */
  updateDutyStatus(
    dutyId: number,
    status: string
  ): Observable<EmployeeDutyResponse> {
    return this.http.patch<EmployeeDutyResponse>(
      `${this.apiUrl}/${dutyId}/status`,
      null,
      {
        params: { status },
      }
    );
  }

  /**
   * Get a single duty by ID
   * GET /api/duties/{dutyId}
   */
  getDutyById(dutyId: number): Observable<EmployeeDutyResponse> {
    return this.http.get<EmployeeDutyResponse>(`${this.apiUrl}/${dutyId}`);
  }

  /**
   * Delete a duty
   * DELETE /api/duties/{dutyId}
   */
  deleteDuty(dutyId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${dutyId}`);
  }
}
