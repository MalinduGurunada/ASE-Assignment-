import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api.config';
import { ChangelogEntry } from '../models';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class ChangelogService {
  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService
  ) {}

  listByRelease(releaseId: number): Observable<ChangelogEntry[]> {
    return this.http.get<ChangelogEntry[]>(`${API_BASE_URL}/api/changelog?releaseId=${releaseId}`, {
      headers: this.authService.authHeaders()
    });
  }

  create(payload: {
    releaseId: number;
    title: string;
    entryType: string;
    description: string;
  }): Observable<ChangelogEntry> {
    return this.http.post<ChangelogEntry>(`${API_BASE_URL}/api/changelog`, payload, {
      headers: this.authService.authHeaders()
    });
  }
}
