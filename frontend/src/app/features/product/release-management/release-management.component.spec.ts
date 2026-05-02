import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { ReleaseManagementComponent } from './release-management.component';

describe('ReleaseManagementComponent', () => {
  let component: ReleaseManagementComponent;
  let fixture: ComponentFixture<ReleaseManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReleaseManagementComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReleaseManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
