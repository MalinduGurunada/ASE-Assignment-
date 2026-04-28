<<<<<<< HEAD
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ReleaseService } from '../../../core/services/release.service';
import { DeploymentService } from '../../../core/services/deployment.service';
import { ProductService } from '../../../core/services/product.service';
=======
import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { Chart, registerables } from 'chart.js';
>>>>>>> shazaan

Chart.register(...registerables);

@Component({
  selector: 'app-metrics',
  standalone: true,
<<<<<<< HEAD
  imports: [RouterLink],
  templateUrl: './metrics.component.html',
  styleUrl: './metrics.component.scss'
})
export class MetricsComponent implements OnInit, AfterViewInit, OnDestroy {
  releasesCompleted = 0;
  activeProducts = 0;
  totalDeployments = 0;
  failedDeployments = 0;

  private weeklyReleases: number[] = [0, 0, 0, 0];
  private weeklyFailed: number[] = [0, 0, 0, 0];
  private weekLabels: string[] = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  private chart?: Chart;
  private dataReady = false;

  constructor(
    private readonly releaseService: ReleaseService,
    private readonly deploymentService: DeploymentService,
    private readonly productService: ProductService
  ) {}

  ngOnInit(): void {
    const weekStarts = this.buildWeekStarts();
    this.weekLabels = weekStarts.map(d =>
      d.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })
    );

    forkJoin({
      releases: this.releaseService.list().pipe(catchError(() => of([]))),
      deployments: this.deploymentService.list().pipe(catchError(() => of([]))),
      products: this.productService.list().pipe(catchError(() => of([])))
    }).subscribe(({ releases, deployments, products }) => {
      this.activeProducts = products.length;
      this.totalDeployments = deployments.length;

      const completed = releases.filter(r => r.status === 'RELEASED');
      this.releasesCompleted = completed.length;

      const failed = deployments.filter(d => d.status === 'FAILED');
      this.failedDeployments = failed.length;

      const weeklyReleases = [0, 0, 0, 0];
      const weeklyFailed = [0, 0, 0, 0];

      completed.forEach(r => {
        const idx = this.weekIndex(new Date(r.releasedAt ?? r.createdAt), weekStarts);
        if (idx >= 0) weeklyReleases[idx]++;
      });

      failed.forEach(d => {
        const idx = this.weekIndex(new Date(d.deployedAt), weekStarts);
        if (idx >= 0) weeklyFailed[idx]++;
      });

      this.weeklyReleases = weeklyReleases;
      this.weeklyFailed = weeklyFailed;
      this.dataReady = true;
      this.renderChart();
    });
  }

  ngAfterViewInit(): void {
    // canvas is ready; chart renders after HTTP data arrives in ngOnInit subscribe
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  private buildWeekStarts(): Date[] {
    const now = new Date();
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    monday.setHours(0, 0, 0, 0);
    return Array.from({ length: 4 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() - (3 - i) * 7);
      return d;
    });
  }

  private weekIndex(date: Date, weekStarts: Date[]): number {
    for (let i = weekStarts.length - 1; i >= 0; i--) {
      if (date >= weekStarts[i]) return i;
    }
    return -1;
  }

  private renderChart(): void {
    this.chart?.destroy();
    this.chart = new Chart('releaseFlowChart', {
      type: 'line',
      data: {
        labels: this.weekLabels,
        datasets: [
          {
            label: 'Releases Completed',
            data: this.weeklyReleases,
=======
  imports: [],
  templateUrl: './metrics.component.html',
  styleUrl: './metrics.component.scss'
})
export class MetricsComponent implements AfterViewInit, OnDestroy {

  private chart?: Chart;

  ngAfterViewInit(): void {
    this.chart = new Chart('releaseFlowChart', {
      type: 'line',
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [
          {
            label: 'Releases Completed',
            data: [2, 4, 3, 6],
>>>>>>> shazaan
            borderColor: '#0f766e',
            backgroundColor: 'rgba(15, 118, 110, 0.25)',
            tension: 0.35,
            fill: true
          },
          {
            label: 'Failed Deployments',
<<<<<<< HEAD
            data: this.weeklyFailed,
=======
            data: [1, 0, 2, 1],
>>>>>>> shazaan
            borderColor: '#dc2626',
            backgroundColor: 'rgba(220, 38, 38, 0.2)',
            tension: 0.35,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }
<<<<<<< HEAD
=======

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

>>>>>>> shazaan
}
