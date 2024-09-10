import { UserForm } from './../model/user.model';
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { ActionButtonComponent } from '../shared/action-button/action-button.component';
import { TransacoesModalComponent } from '../transacoes/transacoes-modal/modal.component';
import { PieChartData, Graficos } from './chart.interface';
import { ChartService } from './chart.service';
import { catchError, lastValueFrom, of } from 'rxjs';
import { MessageService } from 'primeng/api';
import { LoginService } from '../login/login.service';

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
    <div class="grid flex align-items-center justify-content-center">
      <div class="col-12 lg:col-6 xl:col-6">
        <p-card class="card mb-0">
          <div class="flex justify-content-between mb-3">
            <div>
              <span class="block text-500 font-medium mb-3">Transações</span>
              <div class="text-900 font-medium text-xl">{{transactions}}</div>
            </div>
            <div class="flex align-items-center justify-content-center bg-blue-100 border-round" [ngStyle]="{width: '2.5rem', height: '2.5rem'}">
              <i class="pi pi-shopping-cart text-blue-500 text-xl"></i>
            </div>
          </div>
          <span class="text-green-500 font-medium">2 novas </span>
          <span class="text-500">desde a última visita</span>
        </p-card>
      </div>
      <div class="col-12 lg:col-6 xl:col-6">
        <p-card class="card mb-0">
          <div class="flex justify-content-between mb-3">
            <div>
              <span class="block text-500 font-medium mb-3">Ganho</span>
              <div class="text-900 font-medium text-xl">{{profit | currency:'BRL':'symbol':'1.2-2':'pt-BR'}}</div>
            </div>
            <div class="flex align-items-center justify-content-center bg-orange-100 border-round" [ngStyle]="{width: '2.5rem', height: '2.5rem'}">
              <i class="pi pi-wallet text-orange-500 text-xl"></i>
            </div>
          </div>
          <span class="text-green-500 font-medium">%2+ </span>
          <span class="text-500">desde a semana passada</span>
        </p-card>
      </div>
      <div class="col-12 sm:col-12 md:col-6 lg:col-6 xl:col-6" style="background: white">
        <div class="card">
            <h5>Gastos por categoria</h5>
              <p-chart type="doughnut" [data]="spendingCategory" [options]="optionsChartPie" />
          </div>
      </div>
      <div class="col-12 sm:col-12 md:col-6 lg:col-6 xl:col-6" style="background: white">
        <div class="card">
            <h5>Ganhos e Gastos mensais</h5>
              <p-chart id="chart-item" type="line" [data]="chartData" [options]="chartOptions" [responsive]="true"></p-chart>
          </div>
      </div>
      <app-action-button (functionButton)="this.modalVisible = true"></app-action-button>
      <app-transacos-modal (toggleVisible)="modalVisible = false" [visible]="modalVisible" ></app-transacos-modal>
    </div>
  `,
  providers: [MessageService]
})
export class HomeComponent implements OnInit {
  private user: UserForm = {} as UserForm;
  protected chartService: Graficos = inject(ChartService);
  protected messageService: any = inject(MessageService);
  protected authService: any = inject(LoginService);

  modalVisible: boolean = false;
  chartData: any;
  transactions: number = 0;
  profit: number = 0;
  spendingCategory: PieChartData = {} as PieChartData;
  optionsChartPie: any = {};
  teste: PieChartData = {} as PieChartData;

  chartOptions: any;

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.initChart();
  }

  async initChart() {
    this.transactions = await lastValueFrom(this.chartService.getFixed(this.user.id).pipe(
      catchError(error => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao recuperar fixas: ' + error.error.message });
        return of(0);
      })
    ));

    this.profit = await lastValueFrom(this.chartService.getProfit(this.user.id).pipe(
      catchError(error => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao recuperar ganhos: ' + error.error.message });
        return of(0);
      })
    ));

    let value = await lastValueFrom(this.chartService.getSpendingCategory(this.user.id).pipe(
      catchError(error => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao recuperar gastos por categoria: ' + error.error.message });
        return of({ labels: [], datasets: [{ data: [], backgroundColor: [], hoverBackgroundColor: [] }] });
      })
    ));

    this.spendingCategory = value;

    let comparative = await lastValueFrom(this.chartService.getComparative(this.user.id).pipe(
      catchError(error => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao recuperar gastos por categoria: ' + error.error.message });
        return of({ labels: [], datasets: [{ data: [], backgroundColor: [], hoverBackgroundColor: [] }] });
      })
    ));

    let comparativeData = this.prepareDataComparative(comparative);

    console.log('Comparativo: ', comparative)

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.chartData = {
        labels: comparativeData.titles, //['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho'],
        datasets: [
            {
                label: 'Gastos',
                data: comparativeData.valuesDespesa,//[65, 59, 80, 81, 56, 55, 40],
                fill: false,
                backgroundColor: documentStyle.getPropertyValue('--red-700'),
                borderColor: documentStyle.getPropertyValue('--red-700'),
                tension: .4
            },
            {
                label: 'Ganhos',
                data: comparativeData.valuesReceita,//[28, 48, 40, 19, 86, 27, 90],
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

    this.optionsChartPie = {
      cutout: '60%',
      plugins: {
        legend: {
          labels: {
            color: '#4b5563'
          }
        }
      },
      responsive: true,
      scales: {}
    }
  }

  prepareDataComparative(data: any): any {
    let titles = data.meses.map((m: any) => m.title) ?? [];
    let valuesReceita = data.valores.filter((m: any) => m.type === 'R').map((m: any) => m.value) ?? [];
    let valuesDespesa = data.valores.filter((m: any) => m.type === 'D').map((m: any) => m.value) ?? [];

    return {titles, valuesReceita, valuesDespesa};
  }
}
