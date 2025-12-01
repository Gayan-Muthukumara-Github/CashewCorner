import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_CONFIG } from '../config/api.config';
import {
  CreateUserRequest,
  UpdateUserRequest,
  UserResponse,
  UserStatusResponse,
} from '../models/user.models';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly usersUrl = `${API_CONFIG.baseUrl}/users`;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(this.usersUrl);
  }

  createUser(payload: CreateUserRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(this.usersUrl, payload);
  }

  updateUser(userId: number, payload: UpdateUserRequest): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.usersUrl}/${userId}`, payload);
  }

  deactivateUser(userId: number): Observable<UserStatusResponse> {
    return this.http.patch<UserStatusResponse>(`${this.usersUrl}/${userId}/deactivate`, {});
  }

  activateUser(userId: number): Observable<UserStatusResponse> {
    return this.http.patch<UserStatusResponse>(`${this.usersUrl}/${userId}/activate`, {});
  }
}


