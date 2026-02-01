import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_CONFIG } from '../config/api.config';
import {
  CreateRawCashewRequest,
  UpdateRawCashewRequest,
  RawCashewResponse,
} from '../models/raw-cashew.models';

@Injectable({
  providedIn: 'root',
})
export class RawCashewService {
  private readonly rawCashewUrl = `${API_CONFIG.baseUrl}/raw-cashew`;

  constructor(private http: HttpClient) {}

  /**
   * Get all active raw cashew types.
   */
  getRawCashews(): Observable<RawCashewResponse[]> {
    return this.http.get<RawCashewResponse[]>(this.rawCashewUrl);
  }

  /**
   * Get raw cashew type by ID.
   */
  getRawCashewById(cashewTypeId: number): Observable<RawCashewResponse> {
    return this.http.get<RawCashewResponse>(`${this.rawCashewUrl}/${cashewTypeId}`);
  }

  /**
   * Search raw cashew types by type and/or quality.
   */
  searchRawCashews(cashewType?: string, cashewQuality?: string): Observable<RawCashewResponse[]> {
    let params = new HttpParams();
    if (cashewType) {
      params = params.set('cashewType', cashewType);
    }
    if (cashewQuality) {
      params = params.set('cashewQuality', cashewQuality);
    }
    return this.http.get<RawCashewResponse[]>(`${this.rawCashewUrl}/search`, { params });
  }

  /**
   * Create a new raw cashew type.
   */
  createRawCashew(payload: CreateRawCashewRequest): Observable<RawCashewResponse> {
    return this.http.post<RawCashewResponse>(this.rawCashewUrl, payload);
  }

  /**
   * Update raw cashew type information.
   */
  updateRawCashew(cashewTypeId: number, payload: UpdateRawCashewRequest): Observable<RawCashewResponse> {
    return this.http.put<RawCashewResponse>(`${this.rawCashewUrl}/${cashewTypeId}`, payload);
  }

  /**
   * Delete (deactivate) a raw cashew type.
   */
  deleteRawCashew(cashewTypeId: number): Observable<void> {
    return this.http.delete<void>(`${this.rawCashewUrl}/${cashewTypeId}`);
  }
}
