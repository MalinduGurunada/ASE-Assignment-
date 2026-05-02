import { TestBed } from '@angular/core/testing';
import {
  HttpClient,
  HttpErrorResponse,
  provideHttpClient,
  withInterceptors
} from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(() => {
    authService = jasmine.createSpyObj('AuthService', ['getToken', 'clearToken']);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: AuthService, useValue: authService }
      ]
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
  });

  afterEach(() => httpMock.verify());

  it('passes /api/auth/ requests through without Authorization header', () => {
    authService.getToken.and.returnValue('tok');
    http.get('/api/auth/login').subscribe();

    const req = httpMock.expectOne('/api/auth/login');
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({});
  });

  it('adds Authorization header for non-auth requests when token exists', () => {
    authService.getToken.and.returnValue('my-token');
    http.get('/api/releases').subscribe();

    const req = httpMock.expectOne('/api/releases');
    expect(req.request.headers.get('Authorization')).toBe('Bearer my-token');
    req.flush([]);
  });

  it('does not add Authorization header when no token', () => {
    authService.getToken.and.returnValue(null);
    http.get('/api/releases').subscribe({ error: () => {} });

    const req = httpMock.expectOne('/api/releases');
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush([]);
  });

  it('clears token and navigates to /auth/login on 401', () => {
    authService.getToken.and.returnValue('tok');
    http.get('/api/releases').subscribe({ error: () => {} });

    const req = httpMock.expectOne('/api/releases');
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

    expect(authService.clearToken).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
  });

  it('clears token and navigates to /auth/login on 403', () => {
    authService.getToken.and.returnValue('tok');
    http.get('/api/releases').subscribe({ error: () => {} });

    const req = httpMock.expectOne('/api/releases');
    req.flush('Forbidden', { status: 403, statusText: 'Forbidden' });

    expect(authService.clearToken).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
  });
});
