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
    TransacoesModalComponent
  ],
  template: `
    <div class="content">
      @if (isLoading) {
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
                                        <app-transacoes-delete [idTransaction]="item.id" />
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
          <app-transacos-modal (toggleVisible)="modalVisible = false; getTransactions()" [transactionEdit]="editTransaction" [visible]="modalVisible" ></app-transacos-modal>
        }
      }
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

  ngOnInit(): void {
    this.transacoes = this.transactionService.getDataLocally();

    this.getTransactions();
  }

  /*products: any[] = [
      {
        id: '1002',
        description: 'Compra mercado',
        price: 650,
        category: 'Accessories',
        inventoryStatus: 'INSTOCK',
        rating: 5
    },
    {
        id: '1005',
        description: 'Academia',
        price: 54,
        category: 'Accessories',
        inventoryStatus: 'INSTOCK',
        rating: 5
    },
    {
        id: '1007',
        description: 'Compra de roupas novas',
        price: 412,
        category: 'Accessories',
        inventoryStatus: 'INSTOCK',
        rating: 5
    },
  ]*/

  async getTransactions(): Promise<void> {
    this.isLoading = true;
    const transactions: TransactionForm[] = await lastValueFrom(this.transactionService.getTransactions().pipe(
      catchError(error => {
        console.log('Error: ', error.message);
        //this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao recuperar cadastro ' + error.error.message })
        return [];
      })
    ));

    console.log(transactions);

    this.transacoes = transactions;
    this.isLoading = false;
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
