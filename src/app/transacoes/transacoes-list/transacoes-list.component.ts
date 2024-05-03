import { CommonModule } from '@angular/common';
import { Component, DEFAULT_CURRENCY_CODE, EventEmitter, Input, LOCALE_ID, OnInit, Output } from '@angular/core';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { TransactionForm } from '../../model/transaction.model';
import { TabViewModule } from 'primeng/tabview';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TransacoesModalComponent } from '../../transacoes/transacoes-modal/modal.component';
import { TransacoesDeleteComponent } from '../transacoes-delete/transacoes-delete.component';
import { LoadingComponentComponent } from '../../shared/loading-component/loading-component.component';
import { ActionButtonComponent } from '../../shared/action-button/action-button.component';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

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
    ScrollPanelModule,
    ProgressSpinnerModule
  ],
  template: `
    <div class="content">

        <p-scrollPanel [style]="{ width: '100%', height: 'calc(100vh - (67px + 64px + 64px + 66px))' }" styleClass="custombar1">
          @if (loadingContent) {
            @for(item of transacoes; track item.id; let idx = $index; let primeiro = $first){
                <div #transacao class="transacao-item">
                    @if(idx !== transacoes.length-1 || isLoading || last){
                      <div class="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4" [ngClass]="{ 'border-top-1 surface-border': !primeiro, 'first-item' : primeiro }">
                        <div class="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                            <div class="flex flex-column align-items-center sm:align-items-start gap-3">
                                <div class="text-2xl font-bold text-900">{{ item.description }}</div>
                                <div class="flex align-items-center gap-3">
                                    <span class="flex align-items-center gap-2">
                                        <i class="pi pi-tag"></i>
                                        <!--span class="font-semibold">{{ item.category }}</span-->
                                    </span>
                                    <p-tag [value]="item.type == 'D' ? 'Despesa' : 'Receita'" [severity]="getSeverity(item)"></p-tag>
                                    @for (tag of item.tags; track tag) {
                                      <p-tag [value]="tag"></p-tag>
                                    }
                                </div>
                                @if(item.recurrence) {
                                  <div>
                                    <i class="pi pi-undo"></i> {{item.number_recurrence == 0 ? 'Repetir todo mês.' : calcularParcelasExecutadas(item.date_transaction, item.number_recurrence ?? 0)}}
                                  </div>
                                }
                                <div>
                                  <i class="pi pi-calendar"></i> {{item.date_transaction | date:'dd/MM/yyyy'}}
                                </div>
                            </div>
                            <div class="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                              <span class="text-2xl font-semibold">{{item.value | currency:'BRL':'symbol':'1.2-2':'pt-BR'}}</span>
                              <app-transacoes-delete (deleteButton)="isLoading = false; findTransactions(-1, transacoes, true)" [idTransaction]="item.id" />
                              <p-button icon="pi pi-pencil" (click)="editTransaction = item; modalVisible = true"></p-button>
                            </div>
                        </div>
                      </div>
                    }@else {
                      @defer(on viewport(); when isLoading){
                        <div style="width: 100%; height: 10rem; display: flex; justify-content: center; align-items: center">
                          <div class="spinner">
                            <p-progressSpinner></p-progressSpinner>
                          </div>
                          {{findTransactions(idx, transacoes)}}
                          <!-- {{cdRef.markForCheck()}} -->
                        </div>
                      }@placeholder {
                        <div>load</div>
                      }
                    }

                </div>
            }@empty {
              <div #transacao class="transacao-empty">
                <span>Sem nenhuma Transação.</span>
              </div>
            }
          }
          @else {
            <div style="width: 100%; height: 10rem; display: flex; justify-content: center; align-items: center">
              <div class="spinner" style="">
                <p-progressSpinner></p-progressSpinner>
              </div>
            </div>

          }
      </p-scrollPanel>

      <app-action-button (functionButton)="editTransaction = undefined; this.modalVisible = true"></app-action-button>

      @if (modalVisible) {
        <app-transacos-modal (toggleVisible)="hideModal($event)" [transactionEdit]="editTransaction" [visible]="modalVisible" ></app-transacos-modal>
      }
    </div>
  `,
  styles: `
    .content {
      width: 100%;
    }
    .scrollTransactions {
      width: 100%;
      max-height: calc(100vh - (67px + 64px + 64px + 66px));
    }
    .transacao-empty {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px;

      span {
        font-weight: bold;
        font-size: 18px;
      }
    }
    .first-item {
      border-top: 1px solid #00000059;
    }

    p-tabview {
      width: 100%
    }
  `
})
export class TransacoesListComponent implements OnInit {
  editTransaction!: TransactionForm | undefined;
  modalVisible: boolean = false;
  @Output() searchTransactions = new EventEmitter();
  @Output() clear = new EventEmitter();
  @Input() transacoes: TransactionForm[] = [];
  @Input() isLoading: boolean = false;
  @Input() loadingContent: boolean = false;
  @Input() last: boolean = false;

  ngOnInit(): void {
  }

  findTransactions(index: number, transacoes: Array<TransactionForm>, clear?: boolean): void {
    this.last = false;

    if(clear) {
      this.clear.emit(true);
      transacoes = [];
    }

    setTimeout(() => {
      if(index+1 == transacoes.length && !this.isLoading) {
        this.isLoading = true;
        this.searchTransactions.emit(transacoes);
      }
    }, 0);
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

  hideModal(event: any) {
    this.modalVisible = false;

    if(event.alter) {
      this.isLoading = false;
      this.findTransactions(-1, this.transacoes, true)
    }
  }
}
