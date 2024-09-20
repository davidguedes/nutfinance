import { UserForm } from './../model/user.model';
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { ActionButtonComponent } from '../shared/action-button/action-button.component';
import { TransacoesModalComponent } from '../transacoes/transacoes-modal/modal.component';
import { PieChartData, Graficos, DoubleBarChartData } from './chart.interface';
import { ChartService } from './chart.service';
import { catchError, lastValueFrom, of } from 'rxjs';
import { MessageService } from 'primeng/api';
import { LoginService } from '../login/login.service';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ChartModule,
    ActionButtonComponent,
    TransacoesModalComponent,
    SkeletonModule
  ],
  template: `
    <div class="grid flex align-items-center justify-content-center">
      <div class="col-12 lg:col-6 xl:col-6">
        <p-card class="card mb-0">
          <div class="flex justify-content-between mb-3">
            <div>
              <span class="block text-500 font-medium mb-3">Ganhos</span>
              @if(profit == null) {
                <p-skeleton width="8rem" />
              } @else {
                <div class="text-900 font-medium text-xl">{{profit | currency:'BRL':'symbol':'1.2-2':'pt-BR'}}</div>
              }
            </div>
            <div class="flex align-items-center justify-content-center bg-green-100 border-round" [ngStyle]="{width: '2.5rem', height: '2.5rem'}">
              <i class="pi pi-dollar text-green-500 text-xl"></i>
            </div>
          </div>
          <!--span class="text-green-500 font-medium">%2+ </span>
          <span class="text-500">desde a semana passada</span-->
        </p-card>
      </div>
      <div class="col-12 lg:col-6 xl:col-6">
        <p-card class="card mb-0">
          <div class="flex justify-content-between mb-3">
            <div>
              <span class="block text-500 font-medium mb-3">Gastos</span>
              @if(expense == null) {
                <p-skeleton width="8rem" />
              } @else {
                <div class="text-900 font-medium text-xl">{{expense | currency:'BRL':'symbol':'1.2-2':'pt-BR'}}</div>
              }
            </div>
            <div class="flex align-items-center justify-content-center bg-red-100 border-round" [ngStyle]="{width: '2.5rem', height: '2.5rem'}">
              <i class="pi pi-shopping-cart text-red-500 text-xl"></i>
            </div>
          </div>
          <!--span class="text-green-500 font-medium">2 novas </span>
          <span class="text-500">desde a última visita</span-->
        </p-card>
      </div>
      <div class="col-12 sm:col-12 md:col-6 lg:col-6 xl:col-6" style="background: white">
        <div class="card">
            <h5>Gastos por categoria</h5>
            @if(!spendingCategory) {
              <div class="flex align-items-center justify-content-center">
                <p-skeleton shape="circle" size="22rem" />
              </div>
            } @else {
              <p-chart type="doughnut" [data]="spendingCategory" [options]="optionsChartPie" />
            }
          </div>
      </div>
      <div class="col-12 sm:col-12 md:col-6 lg:col-6 xl:col-6" style="background: white">
        <div class="card">
            <h5>Ganhos e Gastos mensais</h5>
            @if(!chartData) {
              <div class="flex align-items-end justify-content-center">
                <p-skeleton width="2rem" height="20rem" class="mr-1" />
                <p-skeleton width="2rem" height="18rem" class="mr-1" />
                <p-skeleton width="2rem" height="19rem" class="mr-1" />
                <p-skeleton width="2rem" height="16rem" class="mr-1" />
                <p-skeleton width="2rem" height="14rem" class="mr-1" />
                <p-skeleton width="2rem" height="20rem" class="mr-1" />
                <p-skeleton width="2rem" height="18rem" class="mr-1" />
                <p-skeleton width="2rem" height="19rem" class="mr-1" />
                <p-skeleton width="2rem" height="16rem" class="mr-1" />
                <p-skeleton width="2rem" height="14rem" class="mr-1" />
              </div>
            } @else {
              <p-chart id="chart-item" type="line" [data]="chartData" [options]="chartOptions" [responsive]="true"></p-chart>
            }
          </div>
      </div>
      <div class="col-12 sm:col-12 md:col-6 lg:col-6 xl:col-6" style="background: white">
        <div class="card">
            <h5>Progresso do mês</h5>
            @if(!progressOfMonth) {
              <div class="flex align-items-end justify-content-center">
                <p-skeleton width="2rem" height="20rem" class="mr-1" />
                <p-skeleton width="2rem" height="18rem" class="mr-1" />
                <p-skeleton width="2rem" height="19rem" class="mr-1" />
                <p-skeleton width="2rem" height="16rem" class="mr-1" />
                <p-skeleton width="2rem" height="14rem" class="mr-1" />
                <p-skeleton width="2rem" height="20rem" class="mr-1" />
                <p-skeleton width="2rem" height="18rem" class="mr-1" />
                <p-skeleton width="2rem" height="19rem" class="mr-1" />
                <p-skeleton width="2rem" height="16rem" class="mr-1" />
                <p-skeleton width="2rem" height="14rem" class="mr-1" />
              </div>
            } @else {
              <p-chart [type]="progressOfMonth?.type" [data]="progressOfMonth?.data" [options]="progressOfMonth?.options" [responsive]="true" />
            }
          </div>
      </div>
      <app-action-button (functionButton)="this.modalVisible = true"></app-action-button>
      <app-transacos-modal (toggleVisible)="modalVisible = false" [visible]="modalVisible" ></app-transacos-modal>
    </div>
  `,
  styles: `
    ::ng-deep .p-card .p-card-content {
      padding: 0px;
    }
  `,
  providers: [MessageService]
})
export class HomeComponent implements OnInit {
  private user: UserForm = {} as UserForm;
  protected chartService: Graficos = inject(ChartService);
  protected messageService: any = inject(MessageService);
  protected authService: any = inject(LoginService);

  modalVisible: boolean = false;
  chartData: any = null;
  transactions: number = 0;
  profit: number | null = null;
  expense: number | null = null;
  spendingCategory: PieChartData | null = null;
  progressOfMonth: any | null = null;
  optionsChartPie: any = {};

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

    this.expense = await lastValueFrom(this.chartService.getExpense(this.user.id).pipe(
      catchError(error => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao recuperar gastos: ' + error.error.message });
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

    let progressOfMonthData = await lastValueFrom(this.chartService.getProgressOfMonth(this.user.id).pipe(
      catchError(error => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao recuperar progresso do mês: ' + error.error.message });
        return of({ labels: [], datasets: [{ data: [], backgroundColor: [], hoverBackgroundColor: [] }] });
      })
    ));

    this.progressOfMonth = this.prepareProgressOfMonth(progressOfMonthData);
    console.log('progressOfMonth: ', this.progressOfMonth);

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
    let titles = data?.meses?.map((m: any) => m.title) ?? [];
    let valuesReceita = data?.valores?.filter((m: any) => m.type === 'R').map((m: any) => m.value) ?? [];
    let valuesDespesa = data?.valores?.filter((m: any) => m.type === 'D').map((m: any) => m.value) ?? [];

    return {titles, valuesReceita, valuesDespesa};
  }
  prepareProgressOfMonth(dataValues: any): any {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    const textColor = documentStyle.getPropertyValue('--text-color');

    const labels = dataValues?.map((item: any) => item.name);
    const actualAmounts = dataValues?.map((item: any) => item.actualAmount);
    const predictedAmounts = dataValues?.map((item: any) => item.predictedAmount);

    const type: string = 'bar';
    const data: any = {
      labels: labels,
      datasets: [
        {
          label: 'Valor Real',
          data: actualAmounts,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
        {
          label: 'Valor Previsto',
          data: predictedAmounts,
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1,
        },
      ],
    };

    const options: any = {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function(context: any) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                label += new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(context.parsed.y);
              }
              return label;
            }
          }
        }
      }
    }

    return {type, data, options};
  }
}
