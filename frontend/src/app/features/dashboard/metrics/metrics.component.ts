import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-metrics',
  standalone: true,
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
            borderColor: '#0f766e',
            backgroundColor: 'rgba(15, 118, 110, 0.25)',
            tension: 0.35,
            fill: true
          },
          {
            label: 'Failed Deployments',
            data: [1, 0, 2, 1],
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

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

}
