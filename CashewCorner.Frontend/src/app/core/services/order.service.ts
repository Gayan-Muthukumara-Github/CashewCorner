import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_CONFIG } from '../config/api.config';
import {
  CreateOrderRequest,
  UpdateOrderRequest,
  OrderResponse,
  AssignProductRequest,
  UpdateProductQuantityRequest,
} from '../models/order.models';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly ordersUrl = `${API_CONFIG.baseUrl}/orders`;

  constructor(private http: HttpClient) {}

  getOrders(): Observable<OrderResponse[]> {
    return this.http.get<OrderResponse[]>(this.ordersUrl);
  }

  getOrderById(orderId: number): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`${this.ordersUrl}/${orderId}`);
  }

  searchOrders(customerName: string): Observable<OrderResponse[]> {
    const params = new HttpParams().set('customerName', customerName);
    return this.http.get<OrderResponse[]>(`${this.ordersUrl}/search`, { params });
  }

  createOrder(payload: CreateOrderRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(this.ordersUrl, payload);
  }

  updateOrder(orderId: number, payload: UpdateOrderRequest): Observable<OrderResponse> {
    return this.http.put<OrderResponse>(`${this.ordersUrl}/${orderId}`, payload);
  }

  deleteOrder(orderId: number): Observable<void> {
    return this.http.delete<void>(`${this.ordersUrl}/${orderId}`);
  }

  assignProductToOrder(orderId: number, payload: AssignProductRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(`${this.ordersUrl}/${orderId}/items`, payload);
  }

  updateProductQuantityInOrder(
    orderId: number,
    orderItemId: number,
    payload: UpdateProductQuantityRequest
  ): Observable<OrderResponse> {
    return this.http.put<OrderResponse>(`${this.ordersUrl}/${orderId}/items/${orderItemId}`, payload);
  }

  removeProductFromOrder(orderId: number, orderItemId: number): Observable<void> {
    return this.http.delete<void>(`${this.ordersUrl}/${orderId}/items/${orderItemId}`);
  }
}
