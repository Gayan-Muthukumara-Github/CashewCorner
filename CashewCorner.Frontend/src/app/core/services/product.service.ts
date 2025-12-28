import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_CONFIG } from '../config/api.config';
import {
  CreateProductRequest,
  UpdateProductRequest,
  ProductResponse,
  AssignCategoryRequest,
} from '../models/product.models';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly productsUrl = `${API_CONFIG.baseUrl}/products`;

  constructor(private http: HttpClient) {}

  getProducts(): Observable<ProductResponse[]> {
    return this.http.get<ProductResponse[]>(this.productsUrl);
  }

  getProductById(productId: number): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.productsUrl}/${productId}`);
  }

  getProductsByCategory(categoryId: number): Observable<ProductResponse[]> {
    return this.http.get<ProductResponse[]>(`${this.productsUrl}/category/${categoryId}`);
  }

  searchProducts(name: string): Observable<ProductResponse[]> {
    const params = new HttpParams().set('name', name);
    return this.http.get<ProductResponse[]>(`${this.productsUrl}/search`, { params });
  }

  createProduct(payload: CreateProductRequest): Observable<ProductResponse> {
    return this.http.post<ProductResponse>(this.productsUrl, payload);
  }

  updateProduct(productId: number, payload: UpdateProductRequest): Observable<ProductResponse> {
    return this.http.put<ProductResponse>(`${this.productsUrl}/${productId}`, payload);
  }

  deleteProduct(productId: number): Observable<void> {
    return this.http.delete<void>(`${this.productsUrl}/${productId}`);
  }

  assignCategoryToProduct(productId: number, payload: AssignCategoryRequest): Observable<ProductResponse> {
    return this.http.post<ProductResponse>(`${this.productsUrl}/${productId}/categories`, payload);
  }

  removeCategoryFromProduct(productId: number, categoryId: number): Observable<void> {
    return this.http.delete<void>(`${this.productsUrl}/${productId}/categories/${categoryId}`);
  }
}
