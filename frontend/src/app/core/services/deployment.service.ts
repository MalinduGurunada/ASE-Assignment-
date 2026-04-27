import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api.config';
import { Deployment, DeploymentStatus } from '../models';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class DeploymentService {
  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService
  ) {}

  list(releaseId?: number): Observable<Deployment[]> {
    const url = releaseId
      ? `${API_BASE_URL}/api/deployments?releaseId=${releaseId}`
      : `${API_BASE_URL}/api/deployments`;
    return this.http.get<Deployment[]>(url, {
      headers: this.authService.authHeaders()
    });
  }

  create(payload: {
    releaseId: number;
    environmentName: string;
    status: DeploymentStatus;
    rollbackAvailable: boolean;
  }): Observable<Deployment> {
    return this.http.post<Deployment>(`${API_BASE_URL}/api/deployments`, payload, {
      headers: this.authService.authHeaders()
    });
  }

  update(
    id: number,
    payload: {
      releaseId: number;
      environmentName: string;
      status: DeploymentStatus;
      rollbackAvailable: boolean;
    }
  ): Observable<Deployment> {
    return this.http.put<Deployment>(`${API_BASE_URL}/api/deployments/${id}`, payload, {
      headers: this.authService.authHeaders()
    });
  }
}
