import { Component, Input, ViewChild, inject } from '@angular/core';
import { TransacoesListComponent } from './transacoes-list/transacoes-list.component';
import { TransacoesFilterComponent } from './transacoes-filter/transacoes-filter.component';
import { TransactionForm } from '../model/transaction.model';
import { catchError, lastValueFrom } from 'rxjs';
import { TransacoesService } from './transacoes.service';
import { Transacoes } from './transacoes.interface';
import { TransacoesFilter } from './transacoes.interface';

@Component({
  selector: 'app-transacoes',
  standalone: true,
  imports: [TransacoesListComponent, TransacoesFilterComponent],
  template: `
    <div>
      <transacoes-filter (onFilter)="onFilter($event)"></transacoes-filter>
      <transacoes-list [loadingContent]="loadingContent" (searchTransactions)="searchTransactions($event)" (clear)="transacoess = []" [transacoes]="transacoess" [isLoading]="loading" [last]="last"></transacoes-list>
    </div>
  `,
  styles: [``]
})
export class TransacoesComponent {
  protected transactionService: Transacoes = inject(TransacoesService);
  @ViewChild(TransacoesListComponent) listTransactions!: TransacoesListComponent;
  transacoess: TransactionForm[] = [];

  loading: boolean = false;
  loadingContent: boolean = false;
  filters: TransacoesFilter = {} as TransacoesFilter;
  last: boolean = false;

  async onFilter(filters: TransacoesFilter) {
    console.log('Os filtros: ', filters);
    this.filters = filters;
    this.transacoess = [];
    this.searchTransactions(this.transacoess);
  }

  async searchTransactions(event: Array<TransactionForm>) {
    console.log('O event aqui ó: ', event);
      this.filters.offset = event.length;
      const transactions: TransactionForm[] = await lastValueFrom(this.transactionService.getTransactions(this.filters).pipe(
        catchError(error => {
          console.log('Error: ', error.message);
          //this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao recuperar cadastro ' + error.error.message })
          return [];
        })
      ));

      console.log('vai setar o laoding ');

      if(transactions.length > 0) {
        setTimeout(async () => {
          this.transacoess = this.setTransacoes(this.transacoess, transactions);
        }, 0);
      } else if(this.transacoess.length > 0) {
        this.last = true;     
      }

      console.log('loading ', this.loading);

  }

  setTransacoes (transacoes: TransactionForm[], searchTransacoes: TransactionForm[]): TransactionForm[]{
    if(transacoes.length == 0){
      transacoes = searchTransacoes;
    }else{
      searchTransacoes.forEach((element: any) => transacoes.push(element));
    }

    this.listTransactions.isLoading = false;
    this.listTransactions.loadingContent = true;
    return transacoes;
  }
}
