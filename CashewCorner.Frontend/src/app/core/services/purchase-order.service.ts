import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_CONFIG } from '../config/api.config';
import {
  CreatePurchaseOrderRequest,
  PurchaseOrderResponse,
  PurchaseOrderItemRequest,
} from '../models/purchase-order.models';

@Injectable({
  providedIn: 'root',
})
export class PurchaseOrderService {
  private readonly purchaseOrdersUrl = `${API_CONFIG.baseUrl}/purchase-orders`;

  constructor(private http: HttpClient) {}

  createPurchaseOrder(payload: CreatePurchaseOrderRequest): Observable<PurchaseOrderResponse> {
    return this.http.post<PurchaseOrderResponse>(this.purchaseOrdersUrl, payload);
  }

  getAllPurchaseOrders(): Observable<PurchaseOrderResponse[]> {
    return this.http.get<PurchaseOrderResponse[]>(this.purchaseOrdersUrl);
  }

  getPurchaseOrderById(purchaseOrderId: number): Observable<PurchaseOrderResponse> {
    return this.http.get<PurchaseOrderResponse>(`${this.purchaseOrdersUrl}/${purchaseOrderId}`);
  }

  searchPurchaseOrders(orderNo: string): Observable<PurchaseOrderResponse[]> {
    const params = new HttpParams().set('orderNo', orderNo);
    return this.http.get<PurchaseOrderResponse[]>(`${this.purchaseOrdersUrl}/search`, { params });
  }

  // Assuming backend will handle updates to existing purchase orders via a PUT request on the main purchase order endpoint
  // For now, only create and retrieve operations are explicitly defined based on provided APIs.
  // If item-specific updates/deletions are needed, similar methods to SalesOrderService or OrderService would be added here.
}
