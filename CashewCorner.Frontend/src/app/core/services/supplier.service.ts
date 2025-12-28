import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_CONFIG } from '../config/api.config';
import {
  CreateSupplierRequest,
  UpdateSupplierRequest,
  SupplierResponse,
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
}
