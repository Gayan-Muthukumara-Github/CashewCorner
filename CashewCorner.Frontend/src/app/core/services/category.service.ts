import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_CONFIG } from '../config/api.config';
import {
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CategoryResponse,
} from '../models/category.models';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly categoriesUrl = `${API_CONFIG.baseUrl}/categories`;

  constructor(private http: HttpClient) {}

  getCategories(): Observable<CategoryResponse[]> {
    return this.http.get<CategoryResponse[]>(this.categoriesUrl);
  }

  getCategoryById(categoryId: number): Observable<CategoryResponse> {
    return this.http.get<CategoryResponse>(`${this.categoriesUrl}/${categoryId}`);
  }

  searchCategories(name: string): Observable<CategoryResponse[]> {
    const params = new HttpParams().set('name', name);
    return this.http.get<CategoryResponse[]>(`${this.categoriesUrl}/search`, { params });
  }

  createCategory(payload: CreateCategoryRequest): Observable<CategoryResponse> {
    return this.http.post<CategoryResponse>(this.categoriesUrl, payload);
  }

  updateCategory(categoryId: number, payload: UpdateCategoryRequest): Observable<CategoryResponse> {
    return this.http.put<CategoryResponse>(`${this.categoriesUrl}/${categoryId}`, payload);
  }

  deleteCategory(categoryId: number): Observable<void> {
    return this.http.delete<void>(`${this.categoriesUrl}/${categoryId}`);
  }
}
