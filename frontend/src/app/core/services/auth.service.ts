import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { API_BASE_URL } from '../api.config';
import { LoginResponse, Role } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenStorageKey = 'rmt_access_token';

  constructor(private readonly http: HttpClient) {}

  login(payload: { username: string; password: string }): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${API_BASE_URL}/api/auth/login`, payload)
      .pipe(tap((response) => this.setToken(response.accessToken)));
  }

  register(payload: { username: string; email: string; password: string; role: Role }): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${API_BASE_URL}/api/auth/register`, payload)
      .pipe(tap((response) => this.setToken(response.accessToken)));
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenStorageKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenStorageKey);
  }

  getRole(): Role | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    try {
      const payload = token.split('.')[1];
      const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
      const decoded = JSON.parse(atob(normalizedPayload));
      return decoded.role === 'ADMIN' || decoded.role === 'VIEWER' ? decoded.role : null;
    } catch {
      return null;
    }
  }

  isAdmin(): boolean {
    return this.getRole() === 'ADMIN';
  }

  clearToken(): void {
    localStorage.removeItem(this.tokenStorageKey);
  }

  authHeaders(): HttpHeaders {
    const token = this.getToken();
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }
}
