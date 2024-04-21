import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { TransacoesService } from '../transacoes.service';
import { Transacoes } from '../transacoes.interface';
import { TransacoesForm } from '../../model/transacoes.model';
import { TabViewModule } from 'primeng/tabview';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TransacoesModalComponent } from '../../transacoes/transacoes-modal/modal.component';
import { TransacoesDeleteComponent } from '../transacoes-delete/transacoes-delete.component';

@Component({
  selector: 'transacoes-list',
  standalone: true,
  imports: [CommonModule, DataViewModule, TagModule, ButtonModule, TabViewModule, ConfirmDialogModule, ToastModule, TransacoesModalComponent, TransacoesDeleteComponent],
  template: `
    <p-tabView>
      <p-tabPanel header="03/2024">
        <div>
          <p-dataView #dv [value]="transacoes">
              <ng-template pTemplate="list" let-transacoes>
                  <div class="grid grid-nogutter">
                      <div class="col-12" *ngFor="let item of transacoes; let first = first">
                          <div class="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4" [ngClass]="{ 'border-top-1 surface-border': !first }">
                              <div class="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                                  <div class="flex flex-column align-items-center sm:align-items-start gap-3">
                                      <div class="text-2xl font-bold text-900">{{ item.descricao }}</div>
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
                                          <i class="pi pi-undo"></i> {{item.numero_recorrencia == '0' ? 'Repetir todo mês.' : calcularParcelasExecutadas(item.data_transacao, item.numero_recorrencia)}}
                                        </div>
                                      }
                                      <div>
                                        <i class="pi pi-calendar"></i> {{item.data_transacao | date:'dd/MM/yyyy'}}
                                      </div>
                                  </div>
                                  <div class="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                                    <span class="text-2xl font-semibold">{{ '$' + item.valor }}</span>
                                    <app-transacoes-delete />
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

    @if (modalVisible) {
      <app-transacos-modal (toggleVisible)="modalVisible = false" [transactionEdit]="editTransaction" [visible]="modalVisible" ></app-transacos-modal>
    }
  `,
  styles: `

  `,
})
export class TransacoesListComponent implements OnInit {
  protected transactionService: Transacoes = inject(TransacoesService);
  editTransaction: TransacoesForm = {} as TransacoesForm;
  modalVisible: boolean = false;
  transacoes: TransacoesForm[] = [];

  ngOnInit(): void {
    this.transacoes = this.transactionService.getDataLocally();
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

  getSeverity (transacao: TransacoesForm) {
      switch (transacao.tipo) {
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
