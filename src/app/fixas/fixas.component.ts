import { Component, OnInit, inject, signal } from '@angular/core';
import { FixasListComponent } from './fixas-list/fixas-list.component';
import { FixasFilterComponent } from './fixas-filter/fixas-filter.component';
import { Fixas, FixasFilter } from './fixas.interface';
import { FixasService } from './fixas.service';
import { Paginator } from '../model/paginator.model';
import { catchError, lastValueFrom } from 'rxjs';
import { FixedForm } from '../model/fixed.model';
import { FixasModalComponent } from './fixas-modal/fixas-modal.component';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { UserForm } from '../model/user.model';
import { LoginService } from '../login/login.service';
import { OrcamentosService } from '../orcamentos/orcamentos.service';
import { Orcamentos } from '../orcamentos/orcamentos.interface';

@Component({
  selector: 'app-fixas',
  standalone: true,
  imports: [FixasListComponent, FixasFilterComponent, FixasModalComponent, ButtonModule],
  template: `
    <div>
      <div class="new-register">
        <p-button class="action-button" label="Novo" (onClick)="modalVisible = !modalVisible"></p-button>
      </div>
      <app-fixas-filter (onFilter)="onFilter(0, paginator.rows, $event)"></app-fixas-filter>
      <app-fixas-list [fixas]="fixed()" [paginator]="paginator" [loading]="loading" (editFixed)="editFixed = $event; modalVisible = !modalVisible" (getFixedList)="onFilter(paginator.first, paginator.rows, filters)"/>
      @if (modalVisible) {
        <app-fixas-modal (toggleVisible)="hideModal($event)" [budgetCategory]="categorias" [fixedEdit]="editFixed" [visible]="modalVisible" ></app-fixas-modal>
      }
    </div>
  `,
  styles: `
    .new-register {
      padding: 10px 20px;
      display: flex;
      align-items: center;
      justify-content: end;
    }
  `,
  providers: [MessageService]
})
export class FixasComponent implements OnInit {
  private user: UserForm = {} as UserForm;
  protected fixedService: Fixas = inject(FixasService);
  protected messageService: any = inject(MessageService);
  protected authService: any = inject(LoginService);
  protected budgetService: Orcamentos = inject(OrcamentosService);
  categorias: any = {
    expense: [],
    income: []
  };

  editFixed!: FixedForm | undefined;
  modalVisible: boolean = false;
  fixed = signal<FixedForm[]>([]);
  loading: boolean = false;
  filters: FixasFilter = {} as FixasFilter;
  paginator: Paginator = { first: 0, rows: 10, total: 0 };

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.getCategorias();
  }

  async onFilter(first: number, rows: number, filters: any) {
    this.filters = filters;
    this.loading = true;
    this.paginator.first = first;
    this.paginator.rows = rows;
    const data = await lastValueFrom(this.fixedService.getFixed(first, rows, filters, this.user.id).pipe(
      catchError(error => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao recuperar fixas: ' + error.error.message })
        return [];
      })
    ))

    this.fixed.update(atual => data.records);
    this.paginator.total = data.totalRecords;
    this.loading = false;
  }

  hideModal(event: any) {
    this.modalVisible = false;

    if(event.alter) {
      this.loading = false;
      this.onFilter(this.paginator.first, this.paginator.rows, this.filters)
    }
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
