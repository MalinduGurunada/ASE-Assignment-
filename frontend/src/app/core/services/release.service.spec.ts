import { TestBed } from '@angular/core/testing';
import { HttpHeaders } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ReleaseService } from './release.service';
import { AuthService } from './auth.service';
import { API_BASE_URL } from '../api.config';
import { Release } from '../models';

const MOCK_RELEASES: Release[] = [
  { id: 1, productId: 10, productName: 'P1', version: '1.0.0', name: 'Alpha', status: 'DRAFT', createdAt: '', releasedAt: null }
];

describe('ReleaseService', () => {
  let service: ReleaseService;
  let http: HttpTestingController;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    authService = jasmine.createSpyObj('AuthService', ['authHeaders']);
    authService.authHeaders.and.returnValue(new HttpHeaders());

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authService }
      ]
    });
    service = TestBed.inject(ReleaseService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('list() calls GET /api/releases', () => {
    service.list().subscribe(releases => expect(releases).toEqual(MOCK_RELEASES));

    const req = http.expectOne(`${API_BASE_URL}/api/releases`);
    expect(req.request.method).toBe('GET');
    req.flush(MOCK_RELEASES);
  });

  it('list(productId) appends productId query param', () => {
    service.list(42).subscribe();

    const req = http.expectOne(`${API_BASE_URL}/api/releases?productId=42`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('create() calls POST /api/releases with payload', () => {
    const payload = { productId: 10, version: '2.0.0', name: 'Beta' };
    service.create(payload).subscribe();

    const req = http.expectOne(`${API_BASE_URL}/api/releases`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush({ ...MOCK_RELEASES[0], ...payload });
  });

  it('transition() calls POST /api/releases/:id/transition', () => {
    service.transition(1, 'TESTING').subscribe();

    const req = http.expectOne(`${API_BASE_URL}/api/releases/1/transition`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ targetStatus: 'TESTING' });
    req.flush({ ...MOCK_RELEASES[0], status: 'TESTING' });
  });

  it('exportCsv() calls GET /api/releases/export.csv', () => {
    service.exportCsv().subscribe();

    const req = http.expectOne(`${API_BASE_URL}/api/releases/export.csv`);
    expect(req.request.method).toBe('GET');
    req.flush(new Blob(['csv'], { type: 'text/csv' }));
  });
});
