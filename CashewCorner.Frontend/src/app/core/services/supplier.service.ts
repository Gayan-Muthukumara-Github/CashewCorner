import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_CONFIG } from '../config/api.config';
import {
  CreateSupplierRequest,
  UpdateSupplierRequest,
  SupplierResponse,
  SupplierRankingResponse,
  PurchaseOrderResponse,
  AdvancedSupplierSearchParams,
} from '../models/supplier.models';

@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  private readonly suppliersUrl = `${API_CONFIG.baseUrl}/suppliers`;

  constructor(private http: HttpClient) {}

  getSuppliers(): Observable<SupplierResponse[]> {
    return this.http.get<SupplierResponse[]>(this.suppliersUrl);
  }

  getSupplierById(supplierId: number): Observable<SupplierResponse> {
    return this.http.get<SupplierResponse>(`${this.suppliersUrl}/${supplierId}`);
  }

  searchSuppliers(name: string): Observable<SupplierResponse[]> {
    const params = new HttpParams().set('name', name);
    return this.http.get<SupplierResponse[]>(`${this.suppliersUrl}/search`, { params });
  }

  createSupplier(payload: CreateSupplierRequest): Observable<SupplierResponse> {
    return this.http.post<SupplierResponse>(this.suppliersUrl, payload);
  }

  updateSupplier(supplierId: number, payload: UpdateSupplierRequest): Observable<SupplierResponse> {
    return this.http.put<SupplierResponse>(`${this.suppliersUrl}/${supplierId}`, payload);
  }

  deleteSupplier(supplierId: number): Observable<void> {
    return this.http.delete<void>(`${this.suppliersUrl}/${supplierId}`);
  }

  /**
   * Get approved suppliers only.
   */
  getApprovedSuppliers(): Observable<SupplierResponse[]> {
    return this.http.get<SupplierResponse[]>(`${this.suppliersUrl}/approved`);
  }

  /**
   * Get all purchase orders for a specific supplier.
   */
  getSupplierOrders(supplierId: number): Observable<PurchaseOrderResponse[]> {
    return this.http.get<PurchaseOrderResponse[]>(`${this.suppliersUrl}/${supplierId}/orders`);
  }

  /**
   * Get supplier ranking by cost and reliability.
   */
  getSupplierRanking(cashewType?: string, quantity?: number): Observable<SupplierRankingResponse[]> {
    let params = new HttpParams();
    if (cashewType) {
      params = params.set('cashewType', cashewType);
    }
    if (quantity !== undefined && quantity !== null) {
      params = params.set('quantity', quantity.toString());
    }
    return this.http.get<SupplierRankingResponse[]>(`${this.suppliersUrl}/ranking`, { params });
  }

  /**
   * Advanced search for suppliers with multiple filter criteria.
   */
  advancedSearchSuppliers(searchParams: AdvancedSupplierSearchParams): Observable<SupplierResponse[]> {
    let params = new HttpParams();

    // Text filters
    if (searchParams.name) params = params.set('name', searchParams.name);
    if (searchParams.address) params = params.set('address', searchParams.address);
    if (searchParams.phone) params = params.set('phone', searchParams.phone);
    if (searchParams.email) params = params.set('email', searchParams.email);
    if (searchParams.contactPerson) params = params.set('contactPerson', searchParams.contactPerson);
    if (searchParams.paymentTerms) params = params.set('paymentTerms', searchParams.paymentTerms);
    if (searchParams.quality) params = params.set('quality', searchParams.quality);
    if (searchParams.season) params = params.set('season', searchParams.season);
    if (searchParams.paymentMethod) params = params.set('paymentMethod', searchParams.paymentMethod);
    if (searchParams.deliveryMethod) params = params.set('deliveryMethod', searchParams.deliveryMethod);
    if (searchParams.performances) params = params.set('performances', searchParams.performances);

    // ID and boolean filters
    if (searchParams.cashewTypeId !== undefined && searchParams.cashewTypeId !== null) {
      params = params.set('cashewTypeId', searchParams.cashewTypeId.toString());
    }
    if (searchParams.isApproved !== undefined && searchParams.isApproved !== null) {
      params = params.set('isApproved', searchParams.isApproved.toString());
    }

    // Range filters
    if (searchParams.minQuantity !== undefined) params = params.set('minQuantity', searchParams.minQuantity.toString());
    if (searchParams.maxQuantity !== undefined) params = params.set('maxQuantity', searchParams.maxQuantity.toString());
    if (searchParams.minCostPerUnit !== undefined) params = params.set('minCostPerUnit', searchParams.minCostPerUnit.toString());
    if (searchParams.maxCostPerUnit !== undefined) params = params.set('maxCostPerUnit', searchParams.maxCostPerUnit.toString());
    if (searchParams.minDistance !== undefined) params = params.set('minDistance', searchParams.minDistance.toString());
    if (searchParams.maxDistance !== undefined) params = params.set('maxDistance', searchParams.maxDistance.toString());
    if (searchParams.minDeliveryCost !== undefined) params = params.set('minDeliveryCost', searchParams.minDeliveryCost.toString());
    if (searchParams.maxDeliveryCost !== undefined) params = params.set('maxDeliveryCost', searchParams.maxDeliveryCost.toString());
    if (searchParams.minTimeTakenToReceive !== undefined) params = params.set('minTimeTakenToReceive', searchParams.minTimeTakenToReceive.toString());
    if (searchParams.maxTimeTakenToReceive !== undefined) params = params.set('maxTimeTakenToReceive', searchParams.maxTimeTakenToReceive.toString());
    if (searchParams.minAverageCostPerUnit !== undefined) params = params.set('minAverageCostPerUnit', searchParams.minAverageCostPerUnit.toString());
    if (searchParams.maxAverageCostPerUnit !== undefined) params = params.set('maxAverageCostPerUnit', searchParams.maxAverageCostPerUnit.toString());
    if (searchParams.minAverageDeliveryTime !== undefined) params = params.set('minAverageDeliveryTime', searchParams.minAverageDeliveryTime.toString());
    if (searchParams.maxAverageDeliveryTime !== undefined) params = params.set('maxAverageDeliveryTime', searchParams.maxAverageDeliveryTime.toString());
    if (searchParams.minAverageDeliveryCost !== undefined) params = params.set('minAverageDeliveryCost', searchParams.minAverageDeliveryCost.toString());
    if (searchParams.maxAverageDeliveryCost !== undefined) params = params.set('maxAverageDeliveryCost', searchParams.maxAverageDeliveryCost.toString());

    return this.http.get<SupplierResponse[]>(`${this.suppliersUrl}/search/advanced`, { params });
  }
}
