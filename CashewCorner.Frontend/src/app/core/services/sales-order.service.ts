import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_CONFIG } from '../config/api.config';
import {
  CreateSalesOrderRequest,
  SalesOrderResponse,
  SalesOrderItemRequest,
} from '../models/sales-order.models';

@Injectable({
  providedIn: 'root',
})
export class SalesOrderService {
  private readonly salesOrdersUrl = `${API_CONFIG.baseUrl}/sales-orders`;

  constructor(private http: HttpClient) {}

  createSalesOrder(payload: CreateSalesOrderRequest): Observable<SalesOrderResponse> {
    return this.http.post<SalesOrderResponse>(this.salesOrdersUrl, payload);
  }

  getAllSalesOrders(): Observable<SalesOrderResponse[]> {
    return this.http.get<SalesOrderResponse[]>(this.salesOrdersUrl);
  }

  getSalesOrderById(salesOrderId: number): Observable<SalesOrderResponse> {
    return this.http.get<SalesOrderResponse>(`${this.salesOrdersUrl}/${salesOrderId}`);
  }

  searchSalesOrders(orderNo: string): Observable<SalesOrderResponse[]> {
    const params = new HttpParams().set('orderNo', orderNo);
    return this.http.get<SalesOrderResponse[]>(`${this.salesOrdersUrl}/search`, { params });
  }

  // Assuming backend will handle updates to existing sales orders via a PUT request on the main sales order endpoint
  // For now, only create and retrieve operations are explicitly defined based on provided APIs.
  // If item-specific updates/deletions are needed, similar methods to OrderService would be added here.

}
