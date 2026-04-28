import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ChangelogEntry, Product, Release, ReleaseStatus } from '../../../core/models';
import { ChangelogService } from '../../../core/services/changelog.service';
import { AuthService } from '../../../core/services/auth.service';
import { ProductService } from '../../../core/services/product.service';
import { ReleaseService } from '../../../core/services/release.service';

@Component({
  selector: 'app-release-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './release-management.component.html',
  styleUrl: './release-management.component.scss'
})
export class ReleaseManagementComponent implements OnInit {

  readonly releaseForm = this.formBuilder.nonNullable.group({
    productId: [0, Validators.required],
    version: ['', Validators.required],
    name: ['', [Validators.required, Validators.maxLength(200)]]
  });

  readonly changelogForm = this.formBuilder.nonNullable.group({
    releaseId: [0, Validators.required],
    title: ['', Validators.required],
    entryType: ['feature', Validators.required],
    description: ['', Validators.required]
  });

  products: Product[] = [];
  releases: Release[] = [];
  changelogEntries: ChangelogEntry[] = [];
  statusOptions: ReleaseStatus[] = ['DRAFT', 'TESTING', 'APPROVED', 'RELEASED'];
  error = '';

  showForm = false;
  selectedReleaseId: number | null = null;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly productService: ProductService,
    private readonly releaseService: ReleaseService,
    private readonly changelogService: ChangelogService
  ) { }

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadReleases();
  }

  statusBadge(status: ReleaseStatus): string {
    const map: Record<ReleaseStatus, string> = {
      DRAFT: 'badge-gray',
      TESTING: 'badge-yellow',
      APPROVED: 'badge-blue',
      RELEASED: 'badge-green'
    };
    return map[status] ?? 'badge-gray';
  }

  loadProducts(): void {
    this.productService.list().subscribe({
      next: (products) => {
        this.products = products;
        if (products.length > 0 && this.releaseForm.value.productId === 0) {
          this.releaseForm.patchValue({ productId: products[0].id });
        }
      },
      error: (err) => {
        this.error = err?.error?.error ?? 'Failed to load products.';
      }
    });
  }

  loadReleases(): void {
    this.releaseService.list().subscribe({
      next: (releases) => {
        this.releases = releases;
      },
      error: (err) => {
        this.error = err?.error?.error ?? 'Failed to load releases.';
      }
    });
  }

  createRelease(): void {
    if (!this.isAdmin || this.releaseForm.invalid || this.releaseForm.value.productId === 0) {
      this.releaseForm.markAllAsTouched();
      return;
    }

    this.releaseService.create(this.releaseForm.getRawValue()).subscribe({
      next: () => {
        this.releaseForm.patchValue({ version: '', name: '' });
        this.loadReleases();
      },
      error: (err) => {
        this.error = err?.error?.error ?? 'Failed to create release.';
      }
    });
  }

  transitionRelease(releaseId: number, nextStatus: ReleaseStatus): void {
    if (!this.isAdmin) {
      return;
    }

    this.releaseService.transition(releaseId, nextStatus).subscribe({
      next: () => this.loadReleases(),
      error: (err) => {
        this.error = err?.error?.error ?? 'Failed to transition release.';
      }
    });
  }

  selectReleaseForChangelog(releaseId: number): void {
    this.selectedReleaseId = releaseId;
    this.changelogForm.patchValue({ releaseId });

    this.changelogService.listByRelease(releaseId).subscribe({
      next: (entries) => {
        this.changelogEntries = entries;
      },
      error: (err) => {
        this.error = err?.error?.error ?? 'Failed to load changelog entries.';
      }
    });
  }

  addChangelog(): void {
    if (this.changelogForm.invalid || this.changelogForm.value.releaseId === 0) {
      this.changelogForm.markAllAsTouched();
      return;
    }

    this.changelogService.create(this.changelogForm.getRawValue()).subscribe({
      next: () => {
        const releaseId = this.changelogForm.getRawValue().releaseId;
        this.changelogForm.patchValue({
          title: '',
          entryType: 'feature',
          description: ''
        });
        this.selectReleaseForChangelog(releaseId);
      },
      error: (err) => {
        this.error = err?.error?.error ?? 'Failed to create changelog entry.';
      }
    });
  }

  exportCsv(): void {
    this.releaseService.exportCsv().subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'releases.csv';
        link.click();
        URL.revokeObjectURL(url);
      },
      error: (err) => {
        this.error = err?.error?.error ?? 'Failed to export CSV.';
      }
    });
  }

  nextStatus(status: ReleaseStatus): ReleaseStatus | null {
    const map: Record<ReleaseStatus, ReleaseStatus | null> = {
      DRAFT: 'TESTING',
      TESTING: 'APPROVED',
      APPROVED: 'RELEASED',
      RELEASED: null
    };
    return map[status];
  }
}
