import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { ActionButtonComponent } from '../shared/action-button/action-button.component';
import { TransacoesModalComponent } from '../transacoes/transacoes-modal/modal.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ChartModule,
    ActionButtonComponent,
    TransacoesModalComponent
  ],
  template: `
    <div class="grid">
      <div class="col-12 lg:col-6 xl:col-6">
        <p-card class="card mb-0">
          <div class="flex justify-content-between mb-3">
            <div>
              <span class="block text-500 font-medium mb-3">Fixas</span>
              <div class="text-900 font-medium text-xl">152</div>
            </div>
            <div class="flex align-items-center justify-content-center bg-blue-100 border-round" [ngStyle]="{width: '2.5rem', height: '2.5rem'}">
              <i class="pi pi-shopping-cart text-blue-500 text-xl"></i>
            </div>
          </div>
          <span class="text-green-500 font-medium">24 novas </span>
          <span class="text-500">desde a última visita</span>
        </p-card>
      </div>
      <div class="col-12 lg:col-6 xl:col-6">
        <p-card class="card mb-0">
          <div class="flex justify-content-between mb-3">
            <div>
              <span class="block text-500 font-medium mb-3">Ganho</span>
              <div class="text-900 font-medium text-xl">R$2.100</div>
            </div>
            <div class="flex align-items-center justify-content-center bg-orange-100 border-round" [ngStyle]="{width: '2.5rem', height: '2.5rem'}">
              <i class="pi pi-wallet text-orange-500 text-xl"></i>
            </div>
          </div>
          <span class="text-green-500 font-medium">%52+ </span>
          <span class="text-500">desde a semana passada</span>
        </p-card>
      </div>
      <div class="col-12 xl:col-12" style="background: white">
        <div class="card">
            <h5>Bar Chart</h5>
              <p-chart id="chart-item" type="line" [data]="chartData" [options]="chartOptions" [responsive]="true"></p-chart>
          </div>
      </div>
      <app-action-button (functionButton)="this.modalVisible = true"></app-action-button>
      <app-transacos-modal (toggleVisible)="modalVisible = false" [visible]="modalVisible" ></app-transacos-modal>
    </div>
  `
})
export class HomeComponent implements OnInit {
  modalVisible: boolean = false;
  chartData: any;

  chartOptions: any;

  ngOnInit(): void {
    this.initChart();
  }

  initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.chartData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'First Dataset',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--bluegray-700'),
                    borderColor: documentStyle.getPropertyValue('--bluegray-700'),
                    tension: .4
                },
                {
                    label: 'Second Dataset',
                    data: [28, 48, 40, 19, 86, 27, 90],
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--green-600'),
                    borderColor: documentStyle.getPropertyValue('--green-600'),
                    tension: .4
                }
            ]
        };

        this.chartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };
  }
}
