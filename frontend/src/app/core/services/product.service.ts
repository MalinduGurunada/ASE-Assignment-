import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api.config';
import { Product } from '../models';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService
  ) {}

  list(): Observable<Product[]> {
    return this.http.get<Product[]>(`${API_BASE_URL}/api/products`, {
      headers: this.authService.authHeaders()
    });
  }

  create(payload: { name: string; description: string }): Observable<Product> {
    return this.http.post<Product>(`${API_BASE_URL}/api/products`, payload, {
      headers: this.authService.authHeaders()
    });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/api/products/${id}`, {
      headers: this.authService.authHeaders()
    });
  }
}
