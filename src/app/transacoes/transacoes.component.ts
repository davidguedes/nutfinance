import { Component, Input, OnInit, ViewChild, inject } from '@angular/core';
import { TransacoesListComponent } from './transacoes-list/transacoes-list.component';
import { TransacoesFilterComponent } from './transacoes-filter/transacoes-filter.component';
import { TransactionForm } from '../model/transaction.model';
import { catchError, lastValueFrom } from 'rxjs';
import { TransacoesService } from './transacoes.service';
import { Transacoes } from './transacoes.interface';
import { TransacoesFilter } from './transacoes.interface';
import { UserForm } from '../model/user.model';
import { LoginService } from '../login/login.service';
import { OrcamentosService } from '../orcamentos/orcamentos.service';
import { Orcamentos } from '../orcamentos/orcamentos.interface';

@Component({
  selector: 'app-transacoes',
  standalone: true,
  imports: [TransacoesListComponent, TransacoesFilterComponent],
  template: `
    <div>
      <transacoes-filter (onFilter)="onFilter($event)"></transacoes-filter>
      <transacoes-list [categorias]="categorias" [loadingContent]="loadingContent" (searchTransactions)="searchTransactions($event)" (clear)="transacoess = []" [transacoes]="transacoess" [isLoading]="loading" [last]="last"></transacoes-list>
    </div>
  `,
  styles: [``]
})
export class TransacoesComponent implements OnInit {
  private user: UserForm = {} as UserForm;
  protected transactionService: Transacoes = inject(TransacoesService);
  protected authService: any = inject(LoginService);
  protected budgetService: Orcamentos = inject(OrcamentosService);
  categorias: any = {
    expense: [],
    income: []
  };
  @ViewChild(TransacoesListComponent) listTransactions!: TransacoesListComponent;
  transacoess: TransactionForm[] = [];

  loading: boolean = false;
  loadingContent: boolean = false;
  filters: TransacoesFilter = {} as TransacoesFilter;
  last: boolean = false;

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.getCategorias();
  }

  async onFilter(filters: TransacoesFilter) {
    this.filters = filters;
    this.transacoess = [];
    this.searchTransactions(this.transacoess);
  }

  async searchTransactions(event: Array<TransactionForm>) {
      this.filters.offset = event.length;
      const transactions: TransactionForm[] = await lastValueFrom(this.transactionService.getTransactions(this.filters, this.user.id).pipe(
        catchError(error => {
          console.log('Error: ', error.message);
          //this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao recuperar cadastro ' + error.error.message })
          return [];
        })
      ));

      if(transactions.length > 0) {
        setTimeout(async () => {
          this.transacoess = this.setTransacoes(this.transacoess, transactions);
        }, 0);
      } else if(this.transacoess.length == 0) {
        this.last = true;
        this.listTransactions.loadingContent = true;
        this.listTransactions.isLoading = false;
      }
  }

  setTransacoes (transacoes: TransactionForm[], searchTransacoes: TransactionForm[]): TransactionForm[]{
    if(transacoes.length == 0){
      transacoes = searchTransacoes;
    }else{
      searchTransacoes.forEach((element: any) => transacoes.push(element));
    }

    this.listTransactions.isLoading = false;
    this.listTransactions.loadingContent = true;

    let dataMesesAnos: any = this.mesesEAnos(transacoes);

    let data = this.ordernarLista(dataMesesAnos);

    transacoes = this.inserirDivisao(data, transacoes);

    return transacoes;
  }

  //Passo 1: Extrair os meses e anos das date_transaction
  mesesEAnos(data: TransactionForm[]): object {
    const monthsAndYears = new Set(data.map(item => {
      const date = new Date(item.date_transaction);
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Mês com zero à esquerda
      const year = date.getFullYear();
      return `${month}/${year}`;
    }));

    return monthsAndYears;
  }

  ordernarLista(data: any[]) {
    // Passo 2: Converter o conjunto para uma lista ordenada
    const sortedMonthsAndYears = Array.from(data).sort((a, b) => {
      const [monthA, yearA] = a.split('/').map(Number);
      const [monthB, yearB] = b.split('/').map(Number);

      if (this.filters.sort === false) {
        return yearA - yearB || monthA - monthB;
      } else {
        return yearB - yearA || monthB - monthA;
      }
    });

    return sortedMonthsAndYears;
  }

  // Passo 3: Criar os objetos de divisão e adicionar à lista original
  inserirDivisao(sortedMonthsAndYears: any[], transacoes: any[]): any[] {
    const result: any[] = [];

    sortedMonthsAndYears.forEach(monthYear => {
      result.push({ date: monthYear });
      transacoes.forEach(item => {
        const date = new Date(item.date_transaction);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        if (`${month}/${year}` === monthYear) {
          result.push(item);
        }
      });
    });

    return result;
  }

  async getCategorias() {
    const categorias: any[] = await lastValueFrom(this.budgetService.getCategory(this.user.id).pipe(
      catchError(error => {
        console.log('Error: ', error.message);
        //this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao recuperar cadastro ' + error.error.message })
        return [];
      })
    ));

    if(categorias.length > 0) {
      this.categorias.income = categorias.filter(cat => cat.type == 'income') ?? [];
      this.categorias.expense = categorias.filter(cat => cat.type == 'expense') ?? [];
    } else
      this.categorias = [];
  }
}
