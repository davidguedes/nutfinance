import { TransactionForm } from './../../model/transaction.model';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TransacoesModalComponent } from '../../transacoes/transacoes-modal/modal.component';
import { TransacoesDeleteComponent } from '../transacoes-delete/transacoes-delete.component';
import { LoadingComponentComponent } from '../../shared/loading-component/loading-component.component';
import { ActionButtonComponent } from '../../shared/action-button/action-button.component';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SkeletonModule } from 'primeng/skeleton';
import { ContextMenu, ContextMenuModule } from 'primeng/contextmenu';
import { MenuItem } from 'primeng/api';

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
    ProgressSpinnerModule,
    SkeletonModule,
    ContextMenuModule
  ],
  template: `
    <div class="content">
      <p-contextMenu #cm [model]="items" />

        <p-scrollPanel [style]="{ width: '100%', height: 'calc(100vh - (67px + 62px + 36px))' }" styleClass="custombar1">
          @if (loadingContent) {
            @for(item of transacoes; track item.id; let primeiro = $first; let idx = $index;){
                <div #transacao class="transacao-item">
                    @if(idx !== transacoes.length-1 || isLoading || last){
                      @if(item.date) {
                        <div class="flex justify-content-center align-items-center flex-column xl:flex-row xl:align-items-center p-4 gap-4" [ngClass]="primeiro ? 'first-item' : 'border-top-1 surface-border'">
                          <div class="text-2xl font-bold text-900">{{item.date }}</div>
                        </div>
                      }

                      @else {
                      <div class="flex flex-column p-4 gap-2" (contextmenu)="onContextMenu($event, item)" [ngClass]="primeiro ? 'first-item' : 'border-top-1 surface-border'">
                          <div class="flex w-full justify-content-between">
                            <div><i class="pi pi-calendar text-xs"></i> <span class="text-xs ml-1">{{item.date_transaction | date:'dd/MM/yyyy'}}</span></div>
                            <div><i (click)="onContextMenu($event, item)" class="pi pi-ellipsis-h"></i></div>
                          </div>
                          <div class="flex flex-column align-items-center gap-1">
                            <span class="text-2xl font-bold">{{item.value | currency:'BRL':'symbol':'1.2-2':'pt-BR'}}</span>
                            <div class="text-1sm text-700">{{ item.description }}</div>
                          </div>
                          <div class="flex align-items-center justify-content-center gap-2">
                              @if(item.isInstallment) {
                                <div>
                                  <i class="pi pi-undo text-xs"></i> <span class="text-xs ml-1">{{item.installmentNumber}}/{{item.totalInstallmentNumber}}</span>
                                </div>
                              }
                              <div class="category-area flex align-items-center"><i class="pi pi-calculator text-xs"></i> <span class="text-xs">{{ item.budgetCategory.category}}</span></div>
                              <span class="flex align-items-center gap-1">
                                <i class="pi pi-tag text-xs"></i>
                                <!--span class="font-semibold">{{ item.category }}</span-->
                              </span>
                              <p-tag class="text-xs" [value]="item.type == 'D' ? 'Gasto' : 'Ganho'" [severity]="getSeverity(item)"></p-tag>
                              @for (tag of item.tags; track tag) {
                                <p-tag class="text-xs" [value]="tag"></p-tag>
                              }
                          </div>
                            <app-transacoes-delete [disabledBtn]="item.closing_id || (item.isInstallment && item?.installmentNumber != undefined && item?.installmentNumber != 1 ) ? true : false" (deleteButton)="isLoading = false; findTransactions(-1, transacoes, true)" [idTransaction]="item.id" />
                            <!--div class="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                              <div>
                                <app-transacoes-delete [disabledBtn]="item.closing_id || (item.isInstallment && item?.installmentNumber != undefined && item?.installmentNumber != 1 ) ? true : false" (deleteButton)="isLoading = false; findTransactions(-1, transacoes, true)" [idTransaction]="item.id" />
                                <p-button icon="pi pi-pencil" [rounded]="true" [text]="true" [disabled]="item.closing_id ? true : false" (click)="editTransaction = item; modalVisible = true"></p-button>
                              </div>
                            </div-->
                      </div>
                      }
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
            <!--div style="width: 100%; height: 10rem; display: flex; justify-content: center; align-items: center">
              <div class="spinner" style="">
                <p-progressSpinner></p-progressSpinner>
              </div>
            </div-->
            <div class="transacao-item">
                <div class="flex justify-content-center align-items-center flex-column xl:flex-row xl:align-items-center p-4 gap-4">
                  <div class="text-2xl font-bold text-900"><p-skeleton width="8rem" height="2rem" borderRadius="16px" /></div>
                </div>
              </div>

            @for(e of [].constructor(10); track e){
              <div class="transacao-item">
                <div class="flex flex-column p-4 gap-2 border-top-1 surface-border">
                  <div class="flex w-full justify-content-between">
                    <div class="flex align-items-center">
                      <span class="flex align-items-center">
                        <i class="pi pi-calendar"></i>
                      </span><p-skeleton class="ml-1" height="1rem" width="4rem" borderRadius="16px" />
                    </div>
                    <p-skeleton height="1rem" width="2rem" borderRadius="16px" />
                  </div>
                  <div class="flex flex-column align-items-center gap-1">
                      <p-skeleton height="2rem" width="8rem" borderRadius="16px" />
                      <p-skeleton height="1rem" width="6rem" borderRadius="16px" />
                    </div>
                  <div class="flex align-items-center justify-content-center gap-2">
                    <span class="flex align-items-center">
                      <i class="pi pi-undo text-xs"></i>
                    </span>
                    <p-skeleton height="1rem" width="2rem" borderRadius="16px" />

                    <span class="flex align-items-center">
                      <i class="pi pi-calculator text-xs"></i>
                    </span>
                    <p-skeleton height="1rem" width="2rem" borderRadius="16px" />

                    <span class="flex align-items-center">
                      <i class="pi pi-tag text-xs"></i>
                    </span>
                    <p-skeleton height="1rem" width="2rem" />
                    <p-skeleton height="1rem" width="2rem" />
                    <p-skeleton height="1rem" width="2rem" />
                  </div>
                </div>
              </div>
            }
          }
      </p-scrollPanel>

      <app-action-button (functionButton)="editTransaction = undefined; this.modalVisible = true"></app-action-button>

      @if (modalVisible) {
        <app-transacos-modal (toggleVisible)="hideModal($event)" [budgetCategory]="categorias" [transactionEdit]="editTransaction" [visible]="modalVisible" ></app-transacos-modal>
      }
    </div>
  `,
  styles: `
    .content {
      width: 100%;
    }
    .category-area {
      background-color: #FEFFC0;
      padding: 5px;
      border-radius: 10px;
      span {
        margin-left: 5px;
        text-align: center;
      }
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
    /*.first-item {
      border-top: 1px solid #00000059;
    }*/

    p-tabview {
      width: 100%
    }
  `
})
export class TransacoesListComponent implements OnInit {
  editTransaction!: TransactionForm | undefined;
  modalVisible: boolean = false;
  items: MenuItem[] | undefined;
  selectedTransaction: TransactionForm | undefined = undefined;
  @Output() searchTransactions = new EventEmitter();
  @Output() clear = new EventEmitter();
  @Input() transacoes: TransactionForm[] = [];
  @Input() isLoading: boolean = false;
  @Input() loadingContent: boolean = false;
  @Input() last: boolean = false;
  @Input() categorias: any = {};
  @ViewChild('cm') cm!: ContextMenu;
  @ViewChild(TransacoesDeleteComponent) transacoesDelete!: TransacoesDeleteComponent;

  ngOnInit(): void {
    this.items = [
      {
        label: 'Editar',
        icon: 'pi pi-pencil',
        disabled: this.editTransaction?.closing_id || (this.editTransaction?.isInstallment && this.editTransaction?.installmentNumber != undefined && this.editTransaction?.installmentNumber != 1 ) ? true : false,
        command: () => { this.editTransaction = this.selectedTransaction; this.modalVisible = true }
      },
      {
        label: 'Excluir',
        icon: 'pi pi-trash',
        disabled: this.selectedTransaction?.closing_id ? true : false,
        command: () => { this.transacoesDelete.confirm() }
      }
  ]
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

  onContextMenu(event: any, item: any) {
    this.selectedTransaction = item;
    this.cm.show(event);
  }
}
