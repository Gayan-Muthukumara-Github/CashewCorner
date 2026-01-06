import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  InventoryResponse,
  InventorySummaryResponse,
  ReceiveStockRequest,
  AdjustStockRequest,
  StockMovementResponse,
  InventorySearchParams,
} from '../models/inventory.models';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  private apiUrl = `${API_CONFIG.baseUrl}/inventory`;

  constructor(private readonly http: HttpClient) {}

  /**
   * Get all inventory records
   * GET /api/inventory
   */
  getAllInventory(): Observable<InventoryResponse[]> {
    return this.http.get<InventoryResponse[]>(this.apiUrl);
  }

  /**
   * Get available inventory (with stock > 0)
   * GET /api/inventory/available
   */
  getAvailableInventory(): Observable<InventoryResponse[]> {
    return this.http.get<InventoryResponse[]>(`${this.apiUrl}/available`);
  }

  /**
   * Get low stock items
   * GET /api/inventory/low-stock
   */
  getLowStockItems(): Observable<InventoryResponse[]> {
    return this.http.get<InventoryResponse[]>(`${this.apiUrl}/low-stock`);
  }

  /**
   * Get inventory by product ID
   * GET /api/inventory/product/{productId}
   */
  getInventoryByProduct(productId: number): Observable<InventoryResponse[]> {
    return this.http.get<InventoryResponse[]>(
      `${this.apiUrl}/product/${productId}`
    );
  }

  /**
   * Get inventory by location
   * GET /api/inventory/location/{location}
   */
  getInventoryByLocation(location: string): Observable<InventoryResponse[]> {
    return this.http.get<InventoryResponse[]>(
      `${this.apiUrl}/location/${encodeURIComponent(location)}`
    );
  }

  /**
   * Search inventory by various criteria
   * GET /api/inventory/search
   */
  searchInventory(params: InventorySearchParams): Observable<InventoryResponse[]> {
    let httpParams = new HttpParams();

    if (params.variety) {
      httpParams = httpParams.set('variety', params.variety);
    }
    if (params.supplierId) {
      httpParams = httpParams.set('supplierId', params.supplierId.toString());
    }
    if (params.location) {
      httpParams = httpParams.set('location', params.location);
    }
    if (params.productName) {
      httpParams = httpParams.set('productName', params.productName);
    }

    return this.http.get<InventoryResponse[]>(`${this.apiUrl}/search`, {
      params: httpParams,
    });
  }

  /**
   * Get inventory summary for dashboard
   * GET /api/inventory/summary
   */
  getInventorySummary(): Observable<InventorySummaryResponse> {
    return this.http.get<InventorySummaryResponse>(`${this.apiUrl}/summary`);
  }

  /**
   * Receive stock into inventory
   * POST /api/inventory/receive
   */
  receiveStock(request: ReceiveStockRequest): Observable<InventoryResponse> {
    return this.http.post<InventoryResponse>(`${this.apiUrl}/receive`, request);
  }

  /**
   * Adjust stock levels
   * POST /api/inventory/adjust
   */
  adjustStock(request: AdjustStockRequest): Observable<InventoryResponse> {
    return this.http.post<InventoryResponse>(`${this.apiUrl}/adjust`, request);
  }

  /**
   * Get stock movements history
   * GET /api/inventory/movements
   */
  getStockMovements(productId?: number): Observable<StockMovementResponse[]> {
    let httpParams = new HttpParams();
    if (productId) {
      httpParams = httpParams.set('productId', productId.toString());
    }
    return this.http.get<StockMovementResponse[]>(`${this.apiUrl}/movements`, {
      params: httpParams,
    });
  }

  /**
   * Search stock movements
   * GET /api/inventory/movements/search
   */
  searchStockMovements(
    productName?: string,
    movementType?: string,
    startDate?: string,
    endDate?: string
  ): Observable<StockMovementResponse[]> {
    let httpParams = new HttpParams();
    if (productName) {
      httpParams = httpParams.set('productName', productName);
    }
    if (movementType) {
      httpParams = httpParams.set('movementType', movementType);
    }
    if (startDate) {
      httpParams = httpParams.set('startDate', startDate);
    }
    if (endDate) {
      httpParams = httpParams.set('endDate', endDate);
    }
    return this.http.get<StockMovementResponse[]>(
      `${this.apiUrl}/movements/search`,
      { params: httpParams }
    );
  }
}
