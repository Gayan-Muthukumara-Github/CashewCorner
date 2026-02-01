import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_CONFIG } from '../config/api.config';
import {
  CreateCustomerRequest,
  UpdateCustomerRequest,
  CustomerResponse,
  AdvancedSearchParams,
  SalesOrderResponse,
  OrderStatusResponse,
} from '../models/customer.models';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private readonly customersUrl = `${API_CONFIG.baseUrl}/customers`;

  constructor(private http: HttpClient) {}

  getCustomers(): Observable<CustomerResponse[]> {
    debugger;
    return this.http.get<CustomerResponse[]>(this.customersUrl);
  }

  getCustomerById(customerId: number): Observable<CustomerResponse> {
    return this.http.get<CustomerResponse>(`${this.customersUrl}/${customerId}`);
  }

  searchCustomers(name: string): Observable<CustomerResponse[]> {
    const params = new HttpParams().set('name', name);
    return this.http.get<CustomerResponse[]>(`${this.customersUrl}/search`, { params });
  }

  searchCustomersAdvanced(searchParams: AdvancedSearchParams): Observable<CustomerResponse[]> {
    let params = new HttpParams();
    if (searchParams.name) {
      params = params.set('name', searchParams.name);
    }
    if (searchParams.phone) {
      params = params.set('phone', searchParams.phone);
    }
    if (searchParams.email) {
      params = params.set('email', searchParams.email);
    }
    if (searchParams.address) {
      params = params.set('address', searchParams.address);
    }
    if (searchParams.type) {
      params = params.set('type', searchParams.type);
    }
    return this.http.get<CustomerResponse[]>(`${this.customersUrl}/search/advanced`, { params });
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

  getCustomerOrders(customerId: number): Observable<SalesOrderResponse[]> {
    return this.http.get<SalesOrderResponse[]>(`${this.customersUrl}/${customerId}/orders`);
  }

  getCustomerOrderStatus(customerId: number): Observable<OrderStatusResponse[]> {
    return this.http.get<OrderStatusResponse[]>(`${this.customersUrl}/${customerId}/orders/status`);
  }
}
