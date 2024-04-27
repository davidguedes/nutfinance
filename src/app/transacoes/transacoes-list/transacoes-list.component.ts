import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { TransacoesService } from '../transacoes.service';
import { Transacoes } from '../transacoes.interface';
import { TransactionForm } from '../../model/transaction.model';
import { TabViewModule } from 'primeng/tabview';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TransacoesModalComponent } from '../../transacoes/transacoes-modal/modal.component';
import { TransacoesDeleteComponent } from '../transacoes-delete/transacoes-delete.component';
import { catchError, lastValueFrom } from 'rxjs';
import { LoadingComponentComponent } from '../../shared/loading-component/loading-component.component';
import { ActionButtonComponent } from '../../shared/action-button/action-button.component';
import { ScrollerModule } from 'primeng/scroller';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';

interface LazyEvent {
  first: number;
  last: number;
}


interface Column {
  field: string;
  header: string;
}


@Component({
  selector: 'transacoes-list',
  standalone: true,
  imports: [CommonModule,
    DataViewModule,
    TagModule,
    ButtonModule,
    TabViewModule,
    ConfirmDialogModule,
    ToastModule,
    TransacoesModalComponent,
    TransacoesDeleteComponent,
    LoadingComponentComponent,
    ActionButtonComponent,
    TransacoesModalComponent,
    ScrollerModule,
    TableModule
  ],
  template: `
    <div class="content">
    <p-table [columns]="cols" [value]="transacoes" [scrollable]="true" scrollHeight="250px" [rows]="5"
        [virtualScroll]="true" [virtualScrollItemSize]="46" [lazy]="true" (onLazyLoad)="getTransactions($event)">
        <ng-template pTemplate="header" let-columns>
            <tr>
                <th *ngFor="let col of columns" style="width: 20%;">
                    {{col.header}}
                </th>
            </tr>
        </ng-template>
        <ng-template pTemplate="body" let-rowData let-columns="columns">
            <tr style="height:46px">
                <td *ngFor="let col of columns">
                    {{rowData[col.field]}}
                </td>
            </tr>
        </ng-template>
        <ng-template pTemplate="loadingbody" let-columns="columns">
            <tr style="height:46px">
                <td *ngFor="let col of columns; let even = even">
                    <p-skeleton [ngStyle]="{'width': even ? (col.field === 'year' ? '30%' : '40%') : '60%'}"></p-skeleton>
                </td>
            </tr>
        </ng-template>
    </p-table>

      <!--p-scroller [items]="transacoes" [itemSize]="50" [showLoader]="true" [delay]="500" [loading]="lazyLoading" [lazy]="true" (onLazyLoad)="getTransactions($event)" styleClass="border-1 surface-border" [style]="{'width': '800px', 'height': '300px'}">
        <ng-template pTemplate="item" let-item let-options="options">
          <div class="flex align-items-center p-2" [ngClass]="{ 'surface-ground': options.odd }" style="height: 50px;">{{ item.id }}</div>
        </ng-template>
      </p-scroller-->

      <!--@if (isLoading) {
        <app-loading-component/>
      } @else {
        <p-tabView>
          <p-tabPanel header="03/2024">
            <div>
              <p-dataView #dv [value]="transacoes" class="data-transactions">
                  <ng-template pTemplate="list" let-transacoes>
                      <div class="grid grid-nogutter">
                          <div class="col-12" *ngFor="let item of transacoes; let first = first">
                              <div class="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4" [ngClass]="{ 'border-top-1 surface-border': !first }">
                                  <div class="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                                      <div class="flex flex-column align-items-center sm:align-items-start gap-3">
                                          <div class="text-2xl font-bold text-900">{{ item.description }}</div>
                                          <div class="flex align-items-center gap-3">
                                              <span class="flex align-items-center gap-2">
                                                  <i class="pi pi-tag"></i>
                                                  <span class="font-semibold">{{ item.category }}</span>
                                              </span>
                                              <p-tag [value]="item.tipo == 'D' ? 'Despesa' : 'Receita'" [severity]="getSeverity(item)"></p-tag>
                                              @for (tag of item.tags; track tag) {
                                                <p-tag [value]="tag"></p-tag>
                                              }
                                          </div>
                                          @if(item.recorrencia) {
                                            <div>
                                              <i class="pi pi-undo"></i> {{item.number_recurrence == '0' ? 'Repetir todo mês.' : calcularParcelasExecutadas(item.date_transaction, item.number_recurrence)}}
                                            </div>
                                          }
                                          <div>
                                            <i class="pi pi-calendar"></i> {{item.date_transaction | date:'dd/MM/yyyy'}}
                                          </div>
                                      </div>
                                      <div class="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                                        <span class="text-2xl font-semibold">{{ 'R$' + item.value }}</span>
                                        <app-transacoes-delete (deleteButton)="getTransactions(filterLazy)" [idTransaction]="item.id" />
                                        <p-button icon="pi pi-pencil" (click)="editTransaction = item; modalVisible = true"></p-button>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </ng-template>
              </p-dataView>
            </div>
          </p-tabPanel>
          <p-tabPanel header="04/2024">
          </p-tabPanel>
          <p-tabPanel header="05/2024">
          </p-tabPanel>
        </p-tabView>
        <app-action-button (functionButton)="editTransaction = undefined; this.modalVisible = true"></app-action-button>

        @if (modalVisible) {
          <app-transacos-modal (toggleVisible)="modalVisible = false; getTransactions(filterLazy)" [transactionEdit]="editTransaction" [visible]="modalVisible" ></app-transacos-modal>
        }
      } -->
    </div>
  `,
  styles: `
    .content {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
    }

    p-tabview {
      width: 100%
    }
  `,
})
export class TransacoesListComponent implements OnInit {
  protected transactionService: Transacoes = inject(TransacoesService);
  editTransaction!: TransactionForm | undefined;
  modalVisible: boolean = false;
  transacoes: TransactionForm[] = [];
  isLoading: boolean = false;
  lazyLoading: boolean = true;
  filterLazy: TableLazyLoadEvent = {first: 0, last: 5};
  loadLazyTimeout: any;
  teste: any = [];
  cols!: Column[];

  ngOnInit(): void {
    //this.transacoes = this.transactionService.getDataLocally();
      this.cols = [
        { field: 'id', header: 'Id' },
        { field: 'vin', header: 'Vin' },
        { field: 'year', header: 'Year' },
        { field: 'brand', header: 'Brand' },
        { field: 'color', header: 'Color' }
    ];

    console.log('chamando pelo oninit')
    this.getTransactions(this.filterLazy);
  }

  async getTransactions(event: TableLazyLoadEvent): Promise<void> {
    console.log('chamando a função aqui ó: ', event);
    console.log('this.transacoes.length: ', this.transacoes.length);
    this.filterLazy = event;
    this.lazyLoading = true;
    this.isLoading = true;

    const transactions: TransactionForm[] = await lastValueFrom(this.transactionService.getTransactions(event.first ?? 0, 5).pipe(
      catchError(error => {
        console.log('Error: ', error.message);
        //this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao recuperar cadastro ' + error.error.message })
        return [];
      })
    ));

    setTimeout(() => {
      console.log('depois da espera:')

      console.log('transactions: ', transactions)

      if(transactions.length > 0)
        this.transacoes = [...this.transacoes, ...transactions];

      console.log('this.transactions: ', this.transacoes)

      this.lazyLoading = false;
      this.isLoading = false;
    }, 500);
  }

  getSeverity (transacao: TransactionForm) {
      switch (transacao.type) {
          case 'R':
              return 'success';

          case 'LOWSTOCK':
              return 'warning';

          case 'D':
              return 'danger';

          default:
              return undefined;
      }
  };

  calcularParcelasExecutadas(dataTransacao: Date, numeroRecorrencia: number): string {
    // Calcula a diferença em milissegundos entre a data atual e a data da transação
    const transacao = new Date(dataTransacao);
    const currentDate = new Date();

    // Calcula a diferença em milissegundos entre as datas
    const diffEmMilissegundos = Math.abs(currentDate.getTime() - transacao.getTime());

    // Converte a diferença de milissegundos para dias
    const diffEmDias = Math.ceil(diffEmMilissegundos / (1000 * 60 * 60 * 24));

    // Calcula o número de parcelas já executadas
    const parcelasExecutadas = Math.min(Math.floor(diffEmDias / 30), numeroRecorrencia) + 1;

    return `${parcelasExecutadas} / ${numeroRecorrencia}` ;
  }
}
