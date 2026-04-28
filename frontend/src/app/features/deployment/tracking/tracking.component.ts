import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
<<<<<<< HEAD
import { RouterLink } from '@angular/router';
=======
>>>>>>> shazaan
import { Deployment, DeploymentStatus, Release } from '../../../core/models';
import { DeploymentService } from '../../../core/services/deployment.service';
import { ReleaseService } from '../../../core/services/release.service';

@Component({
  selector: 'app-tracking',
  standalone: true,
<<<<<<< HEAD
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
=======
  imports: [CommonModule, ReactiveFormsModule],
>>>>>>> shazaan
  templateUrl: './tracking.component.html',
  styleUrl: './tracking.component.scss'
})
export class TrackingComponent implements OnInit {
  readonly form = this.formBuilder.nonNullable.group({
    releaseId: [0, Validators.required],
    environmentName: ['dev', Validators.required],
    status: ['PENDING' as DeploymentStatus, Validators.required],
    rollbackAvailable: [false]
  });

  releases: Release[] = [];
  deployments: Deployment[] = [];
  error = '';
<<<<<<< HEAD
  showForm = false;

  statusBadge(status: string): string {
    const map: Record<string, string> = {
      PENDING: 'badge-yellow', DEPLOYED: 'badge-green', FAILED: 'badge-red', ROLLED_BACK: 'badge-purple'
    };
    return map[status] ?? 'badge-gray';
  }
=======
>>>>>>> shazaan

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly releaseService: ReleaseService,
    private readonly deploymentService: DeploymentService
  ) {}

  ngOnInit(): void {
    this.loadReleases();
    this.loadDeployments();
  }

  loadReleases(): void {
    this.releaseService.list().subscribe({
      next: (releases) => {
        this.releases = releases;
        if (releases.length > 0 && this.form.value.releaseId === 0) {
          this.form.patchValue({ releaseId: releases[0].id });
        }
      },
      error: (err) => {
        this.error = err?.error?.error ?? 'Failed to load releases.';
      }
    });
  }

  loadDeployments(): void {
    this.deploymentService.list().subscribe({
      next: (deployments) => {
        this.deployments = deployments;
      },
      error: (err) => {
        this.error = err?.error?.error ?? 'Failed to load deployments.';
      }
    });
  }

  createDeployment(): void {
    if (this.form.invalid || this.form.value.releaseId === 0) {
      this.form.markAllAsTouched();
      return;
    }

    this.deploymentService.create(this.form.getRawValue()).subscribe({
      next: () => {
        this.loadDeployments();
      },
      error: (err) => {
        this.error = err?.error?.error ?? 'Failed to create deployment.';
      }
    });
  }

}
