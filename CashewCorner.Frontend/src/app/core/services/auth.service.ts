import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, throwError, tap, finalize, of, Subject } from 'rxjs';

import { API_CONFIG } from '../config/api.config';
import { LoginRequest, LoginResponse } from '../models/auth.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly authUrl = `${API_CONFIG.baseUrl}/auth`;
  private readonly storageKeys = {
    accessToken: 'cc_access_token',
    refreshToken: 'cc_refresh_token',
    user: 'cc_user',
    tokenType: 'cc_token_type',
    expiresAt: 'cc_token_expires_at',
  };
  private sessionTimeoutHandle: ReturnType<typeof setTimeout> | null = null;
  private sessionExpiredSubject = new Subject<void>();
  sessionExpired$ = this.sessionExpiredSubject.asObservable();

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
  ) {
    this.restoreSessionTimer();
  }

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.authUrl}/login`, payload).pipe(
      tap((response) => this.persistSession(response)),
      catchError((error) => this.handleError(error)),
    );
  }

  logout(redirectToLogin = false): void {
    if (!this.isBrowser()) {
      return;
    }

    Object.values(this.storageKeys).forEach((key) => localStorage.removeItem(key));
    this.clearSessionTimer();

    if (redirectToLogin) {
      this.router.navigate(['/admin/login']);
    }
  }

  logoutFromServer(): Observable<void> {
    const token = this.getAccessToken();

    if (!token) {
      this.logout(true);
      return of(void 0);
    }

    const headers = new HttpHeaders({
      Authorization: `${this.getTokenType() ?? 'Bearer'} ${token}`,
    });

    return this.http.post<void>(`${this.authUrl}/logout`, {}, { headers }).pipe(
      catchError(() => of(void 0)),
      finalize(() => this.logout(true)),
    );
  }

  getCurrentUser() {
    if (!this.isBrowser()) {
      return null;
    }

    const user = localStorage.getItem(this.storageKeys.user);
    return user ? JSON.parse(user) : null;
  }

  hasActiveSession(): boolean {
    const token = this.getAccessToken();
    if (!token) {
      return false;
    }

    if (this.isTokenExpired()) {
      this.handleSessionExpiry();
      return false;
    }

    return true;
  }

  isTokenExpired(): boolean {
    if (!this.isBrowser()) {
      return true;
    }

    const expiresAt = localStorage.getItem(this.storageKeys.expiresAt);
    if (!expiresAt) {
      return false;
    }

    const expiresAtMs = Number(expiresAt);
    return Number.isFinite(expiresAtMs) && Date.now() >= expiresAtMs;
  }

  getAccessToken(): string | null {
    if (!this.isBrowser()) {
      return null;
    }
    return localStorage.getItem(this.storageKeys.accessToken);
  }

  getTokenType(): string | null {
    if (!this.isBrowser()) {
      return null;
    }
    return localStorage.getItem(this.storageKeys.tokenType);
  }

  private persistSession(response: LoginResponse): void {
    if (!this.isBrowser()) {
      return;
    }

    const expiresAt = response.expiresIn
      ? Date.now() + response.expiresIn * 1000
      : undefined;

    localStorage.setItem(this.storageKeys.accessToken, response.accessToken);
    localStorage.setItem(this.storageKeys.refreshToken, response.refreshToken);
    localStorage.setItem(this.storageKeys.tokenType, response.tokenType);

    if (response.user) {
      localStorage.setItem(this.storageKeys.user, JSON.stringify(response.user));
    }

    if (expiresAt) {
      localStorage.setItem(this.storageKeys.expiresAt, expiresAt.toString());
    }

    this.startSessionTimer(expiresAt);
  }

  private handleError(error: HttpErrorResponse) {
    const fallbackMessage = 'Unable to sign in. Please try again.';
    const serverMessage =
      (typeof error.error === 'string' && error.error) ||
      error.error?.message ||
      error.message;
    const message =
      error.status === 0
        ? 'Cannot reach authentication service. Check if the backend is running.'
        : serverMessage || fallbackMessage;

    return throwError(() => new Error(message));
  }

  private startSessionTimer(expiresAt?: number): void {
    this.clearSessionTimer();

    if (!expiresAt) {
      return;
    }

    const timeout = expiresAt - Date.now();

    if (timeout <= 0) {
      this.handleSessionExpiry();
      return;
    }

    this.sessionTimeoutHandle = setTimeout(() => this.handleSessionExpiry(), timeout);
  }

  private clearSessionTimer(): void {
    if (this.sessionTimeoutHandle) {
      clearTimeout(this.sessionTimeoutHandle);
      this.sessionTimeoutHandle = null;
    }
  }

  private restoreSessionTimer(): void {
    if (!this.isBrowser()) {
      return;
    }

    const expiresAt = localStorage.getItem(this.storageKeys.expiresAt);
    if (!expiresAt) {
      return;
    }

    const expiresAtMs = Number(expiresAt);
    if (!Number.isFinite(expiresAtMs)) {
      return;
    }

    this.startSessionTimer(expiresAtMs);
  }

  private handleSessionExpiry(): void {
    this.sessionExpiredSubject.next();
    this.logout();
    this.router.navigate(['/admin/login'], {
      queryParams: { sessionExpired: true, returnUrl: '/admin' },
    });
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }
}
