import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  RawCashewInventoryResponse,
  RawCashewInventorySummaryResponse,
  ReceiveRawCashewStockRequest,
  AdjustRawCashewStockRequest,
  RawCashewStockMovementResponse,
  RawCashewInventorySearchParams,
} from '../models/raw-cashew-inventory.models';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class RawCashewInventoryService {
  private apiUrl = `${API_CONFIG.baseUrl}/raw-cashew-inventory`;

  constructor(private readonly http: HttpClient) {}

  /**
   * Receive raw cashew stock into inventory
   * POST /api/raw-cashew-inventory/receive
   */
  receiveStock(request: ReceiveRawCashewStockRequest): Observable<RawCashewInventoryResponse> {
    return this.http.post<RawCashewInventoryResponse>(`${this.apiUrl}/receive`, request);
  }

  /**
   * Adjust raw cashew stock (add, remove, usage, damage, correction)
   * POST /api/raw-cashew-inventory/adjust
   */
  adjustStock(request: AdjustRawCashewStockRequest): Observable<RawCashewInventoryResponse> {
    return this.http.post<RawCashewInventoryResponse>(`${this.apiUrl}/adjust`, request);
  }

  /**
   * Get all raw cashew inventory records
   * GET /api/raw-cashew-inventory
   */
  getAllInventory(): Observable<RawCashewInventoryResponse[]> {
    return this.http.get<RawCashewInventoryResponse[]>(this.apiUrl);
  }

  /**
   * Get raw cashew inventory with available stock only
   * GET /api/raw-cashew-inventory/available
   */
  getAvailableInventory(): Observable<RawCashewInventoryResponse[]> {
    return this.http.get<RawCashewInventoryResponse[]>(`${this.apiUrl}/available`);
  }

  /**
   * Get low stock raw cashew items
   * GET /api/raw-cashew-inventory/low-stock
   */
  getLowStockItems(): Observable<RawCashewInventoryResponse[]> {
    return this.http.get<RawCashewInventoryResponse[]>(`${this.apiUrl}/low-stock`);
  }

  /**
   * Get inventory for a specific raw cashew type
   * GET /api/raw-cashew-inventory/cashew-type/{cashewTypeId}
   */
  getInventoryByCashewType(cashewTypeId: number): Observable<RawCashewInventoryResponse[]> {
    return this.http.get<RawCashewInventoryResponse[]>(`${this.apiUrl}/cashew-type/${cashewTypeId}`);
  }

  /**
   * Get raw cashew inventory summary
   * GET /api/raw-cashew-inventory/summary
   */
  getInventorySummary(): Observable<RawCashewInventorySummaryResponse> {
    return this.http.get<RawCashewInventorySummaryResponse>(`${this.apiUrl}/summary`);
  }

  /**
   * Search raw cashew inventory by various criteria
   * GET /api/raw-cashew-inventory/search
   */
  searchInventory(params: RawCashewInventorySearchParams): Observable<RawCashewInventoryResponse[]> {
    let httpParams = new HttpParams();

    if (params.cashewType) {
      httpParams = httpParams.set('cashewType', params.cashewType);
    }
    if (params.cashewQuality) {
      httpParams = httpParams.set('cashewQuality', params.cashewQuality);
    }
    if (params.location) {
      httpParams = httpParams.set('location', params.location);
    }

    return this.http.get<RawCashewInventoryResponse[]>(`${this.apiUrl}/search`, {
      params: httpParams,
    });
  }

  /**
   * Get stock movements for raw cashews
   * GET /api/raw-cashew-inventory/movements
   */
  getStockMovements(cashewTypeId?: number): Observable<RawCashewStockMovementResponse[]> {
    let httpParams = new HttpParams();
    if (cashewTypeId) {
      httpParams = httpParams.set('cashewTypeId', cashewTypeId.toString());
    }
    return this.http.get<RawCashewStockMovementResponse[]>(`${this.apiUrl}/movements`, {
      params: httpParams,
    });
  }
}
