import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { API_BASE_URL } from '../api.config';

const FAKE_TOKEN = [
  btoa(JSON.stringify({ alg: 'HS256' })),
  btoa(JSON.stringify({ sub: 'alice', role: 'ADMIN' })),
  'sig'
].join('.');

describe('AuthService', () => {
  let service: AuthService;
  let http: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('login posts credentials and stores token', () => {
    service.login({ username: 'alice', password: 'secret' }).subscribe();

    const req = http.expectOne(`${API_BASE_URL}/api/auth/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ username: 'alice', password: 'secret' });
    req.flush({ accessToken: FAKE_TOKEN });

    expect(service.getToken()).toBe(FAKE_TOKEN);
  });

  it('register posts payload and stores token', () => {
    service.register({ username: 'bob', email: 'bob@rmt.local', password: 'pass', role: 'VIEWER' }).subscribe();

    const req = http.expectOne(`${API_BASE_URL}/api/auth/register`);
    expect(req.request.method).toBe('POST');
    req.flush({ accessToken: FAKE_TOKEN });

    expect(service.getToken()).toBe(FAKE_TOKEN);
  });

  it('setToken and getToken round-trip', () => {
    service.setToken('tok123');
    expect(service.getToken()).toBe('tok123');
  });

  it('clearToken removes token from storage', () => {
    service.setToken('tok123');
    service.clearToken();
    expect(service.getToken()).toBeNull();
  });

  it('getRole returns ADMIN from a valid JWT', () => {
    service.setToken(FAKE_TOKEN);
    expect(service.getRole()).toBe('ADMIN');
  });

  it('getRole returns null when no token is stored', () => {
    expect(service.getRole()).toBeNull();
  });

  it('isAdmin returns true when role is ADMIN', () => {
    service.setToken(FAKE_TOKEN);
    expect(service.isAdmin()).toBeTrue();
  });

  it('isAdmin returns false when no token', () => {
    expect(service.isAdmin()).toBeFalse();
  });

  it('authHeaders includes Authorization when token is present', () => {
    service.setToken('mytoken');
    expect(service.authHeaders().get('Authorization')).toBe('Bearer mytoken');
  });

  it('authHeaders returns empty headers when no token', () => {
    expect(service.authHeaders().get('Authorization')).toBeNull();
  });
});
