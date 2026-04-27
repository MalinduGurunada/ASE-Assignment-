import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api.config';
import { Release, ReleaseStatus } from '../models';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class ReleaseService {
  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService
  ) {}

  list(productId?: number): Observable<Release[]> {
    const url = productId
      ? `${API_BASE_URL}/api/releases?productId=${productId}`
      : `${API_BASE_URL}/api/releases`;
    return this.http.get<Release[]>(url, {
      headers: this.authService.authHeaders()
    });
  }

  create(payload: { productId: number; version: string; name: string }): Observable<Release> {
    return this.http.post<Release>(`${API_BASE_URL}/api/releases`, payload, {
      headers: this.authService.authHeaders()
    });
  }

  transition(releaseId: number, targetStatus: ReleaseStatus): Observable<Release> {
    return this.http.post<Release>(
      `${API_BASE_URL}/api/releases/${releaseId}/transition`,
      { targetStatus },
      { headers: this.authService.authHeaders() }
    );
  }

  exportCsv(): Observable<Blob> {
    return this.http.get(`${API_BASE_URL}/api/releases/export.csv`, {
      headers: this.authService.authHeaders(),
      responseType: 'blob'
    });
  }
}
