import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_CONFIG } from '../config/api.config';
import {
  CreateCustomerRequest,
  UpdateCustomerRequest,
  CustomerResponse,
} from '../models/customer.models';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private readonly customersUrl = `${API_CONFIG.baseUrl}/customers`;

  constructor(private http: HttpClient) {}

  getCustomers(): Observable<CustomerResponse[]> {
    return this.http.get<CustomerResponse[]>(this.customersUrl);
  }

  getCustomerById(customerId: number): Observable<CustomerResponse> {
    return this.http.get<CustomerResponse>(`${this.customersUrl}/${customerId}`);
  }

  searchCustomers(name: string): Observable<CustomerResponse[]> {
    const params = new HttpParams().set('name', name);
    return this.http.get<CustomerResponse[]>(`${this.customersUrl}/search`, { params });
  }

  createCustomer(payload: CreateCustomerRequest): Observable<CustomerResponse> {
    return this.http.post<CustomerResponse>(this.customersUrl, payload);
  }

  updateCustomer(customerId: number, payload: UpdateCustomerRequest): Observable<CustomerResponse> {
    return this.http.put<CustomerResponse>(`${this.customersUrl}/${customerId}`, payload);
  }

  deleteCustomer(customerId: number): Observable<void> {
    return this.http.delete<void>(`${this.customersUrl}/${customerId}`);
  }
}
