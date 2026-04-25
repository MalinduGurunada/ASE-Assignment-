import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { RollbacksComponent } from './rollbacks.component';

describe('RollbacksComponent', () => {
  let component: RollbacksComponent;
  let fixture: ComponentFixture<RollbacksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RollbacksComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RollbacksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
