import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Deployment } from '../../../core/models';
import { DeploymentService } from '../../../core/services/deployment.service';

@Component({
  selector: 'app-rollbacks',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rollbacks.component.html',
  styleUrl: './rollbacks.component.scss'
})
export class RollbacksComponent implements OnInit {
  deployments: Deployment[] = [];
  error = '';

  constructor(private readonly deploymentService: DeploymentService) {}

  ngOnInit(): void {
    this.loadDeployments();
  }

  loadDeployments(): void {
    this.deploymentService.list().subscribe({
      next: (deployments) => {
        this.deployments = deployments.filter((deployment) => deployment.rollbackAvailable);
      },
      error: (err) => {
        this.error = err?.error?.error ?? 'Failed to load rollback candidates.';
      }
    });
  }

  rollback(deployment: Deployment): void {
    this.deploymentService
      .update(deployment.id, {
        releaseId: deployment.releaseId,
        environmentName: deployment.environmentName,
        status: 'ROLLED_BACK',
        rollbackAvailable: deployment.rollbackAvailable
      })
      .subscribe({
        next: () => this.loadDeployments(),
        error: (err) => {
          this.error = err?.error?.error ?? 'Rollback failed.';
        }
      });
  }

}
