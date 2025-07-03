import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Subject, takeUntil } from 'rxjs';
import {
  ApexChart,
  ChartComponent,
  NgApexchartsModule,
  ApexAxisChartSeries,
  ApexPlotOptions
} from 'ng-apexcharts';
import { ProductStats } from '../../../models/product.model';
import { ProductService } from '../../../core/services/product.service';

interface ChartOptions {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  colors: string[];
  plotOptions: ApexPlotOptions;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, NgApexchartsModule],
  template: `
    <div class="dashboard-container">
      <!-- Stats Cards -->
      <div class="stats-grid">
        <mat-card>
          <mat-card-content>
            <div class="stat-item">
              <div class="stat-icon">
                <mat-icon>inventory_2</mat-icon>
              </div>
              <div class="stat-info">
                <h3>Total Products</h3>
                <p class="stat-value">{{stats?.totalProducts || 0}}</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card>
          <mat-card-content>
            <div class="stat-item">
              <div class="stat-icon">
                <mat-icon>attach_money</mat-icon>
              </div>
              <div class="stat-info">
                <h3>Average Price</h3>
                <p class="stat-value">{{stats?.averagePrice | currency}}</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card>
          <mat-card-content>
            <div class="stat-item">
              <div class="stat-icon">
                <mat-icon>account_balance</mat-icon>
              </div>
              <div class="stat-info">
                <h3>Total Value</h3>
                <p class="stat-value">{{stats?.totalValue | currency}}</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Category Distribution Chart -->
      <mat-card class="chart-card">
        <mat-card-header>
          <mat-card-title>Category Distribution</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <apx-chart
            [series]="chartOptions.series"
            [chart]="chartOptions.chart"
            [labels]="chartOptions.labels"
            [colors]="chartOptions.colors"
            [plotOptions]="chartOptions.plotOptions">
          </apx-chart>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .stat-icon {
      background-color: #f5f5f5;
      border-radius: 50%;
      padding: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat-info h3 {
      margin: 0;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.6);
    }

    .stat-value {
      margin: 4px 0 0;
      font-size: 24px;
      font-weight: 500;
    }

    .chart-card {
      margin-top: 20px;
    }
  `]
})
export class DashboardComponent implements OnInit {
  private productService = inject(ProductService);
  private destroy$ = new Subject<void>();
  protected stats: ProductStats | null = null;

  protected chartOptions: ChartOptions = {
    series: [{
      name: 'Products',
      data: []
    }],
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: false
      }
    },
    labels: [],
    colors: ['#3F51B5', '#E91E63', '#00BCD4', '#8BC34A', '#FFC107', '#FF5722'],
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: true
      }
    }
  };

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.destroy$.next();
      this.destroy$.complete();
    });
  }

  ngOnInit() {
    this.loadStats();
  }

  private loadStats() {
    this.productService.getProductStats().pipe(
      takeUntil(this.destroy$)
    ).subscribe(stats => {
      this.stats = stats;
      this.updateChart(stats);
    });
  }

  private updateChart(stats: ProductStats) {
    this.chartOptions.series = [{
      name: 'Products',
      data: stats.categoryDistribution.map(item => item.count)
    }];
    this.chartOptions.labels = stats.categoryDistribution.map(item => item.category);
  }
}
