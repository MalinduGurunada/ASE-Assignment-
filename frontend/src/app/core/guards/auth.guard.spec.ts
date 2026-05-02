import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, UrlTree } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

function runGuard() {
  return TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
}

describe('authGuard', () => {
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    authService = jasmine.createSpyObj('AuthService', ['getToken']);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: AuthService, useValue: authService }
      ]
    });
  });

  it('returns true when a token is present', () => {
    authService.getToken.and.returnValue('some-jwt');
    expect(runGuard()).toBeTrue();
  });

  it('returns a UrlTree redirecting to /auth/login when no token', () => {
    authService.getToken.and.returnValue(null);
    const result = runGuard();
    expect(result instanceof UrlTree).toBeTrue();
    const router = TestBed.inject(Router);
    expect(router.serializeUrl(result as UrlTree)).toBe('/auth/login');
  });
});
