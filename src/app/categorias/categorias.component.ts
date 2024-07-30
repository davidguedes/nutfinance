import { Component, inject, signal } from '@angular/core';
import { CategoriasFilterComponent } from "./categorias-filter/categorias-filter.component";
import { CategoriasListComponent } from "./categorias-list/categorias-list.component";
import { UserForm } from '../model/user.model';
import { Categorias, CategoriasFilter } from './categorias.interface';
import { CategoriasService } from './categorias.service';
import { MessageService } from 'primeng/api';
import { LoginService } from '../login/login.service';
import { CategoryForm } from '../model/category.model';
import { Paginator } from '../model/paginator.model';
import { catchError, lastValueFrom } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { CategoriasModalComponent } from "./categorias-modal/categorias-modal.component";

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [ButtonModule, CategoriasFilterComponent, CategoriasListComponent, CategoriasModalComponent],
  template: `
    <div>
      <div class="new-register">
        <p-button class="action-button" label="Novo" (onClick)="modalVisible = !modalVisible"></p-button>
      </div>
      <app-categorias-filter (onFilter)="onFilter(0, paginator.rows, $event)"></app-categorias-filter>
      <app-categorias-list [categorias]="category()" [paginator]="paginator" [loading]="loading" (editCategory)="editCategory = $event; modalVisible = !modalVisible" (getCategoryList)="onFilter(paginator.first, paginator.rows, filters)"/>
      <div>@if (modalVisible) {
        <app-categorias-modal (toggleVisible)="hideModal($event)" [categoryEdit]="editCategory" [visible]="modalVisible" ></app-categorias-modal>
      }</div>
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
export class CategoriasComponent {
  private user: UserForm = {} as UserForm;
  protected categoryService: Categorias = inject(CategoriasService);
  protected messageService: any = inject(MessageService);
  protected authService: any = inject(LoginService);

  editCategory!: CategoryForm | undefined;
  modalVisible: boolean = false;
  category = signal<CategoryForm[]>([]);
  loading: boolean = false;
  filters: CategoriasFilter = {} as CategoriasFilter;
  paginator: Paginator = { first: 0, rows: 10, total: 0 };

  ngOnInit(): void {
    this.user = this.authService.getUser();
  }

  async onFilter(first: number, rows: number, filters: any) {
    this.filters = filters;
    this.loading = true;
    this.paginator.first = first;
    this.paginator.rows = rows;
    const data = await lastValueFrom(this.categoryService.getCategory(first, rows, filters, this.user.id).pipe(
      catchError(error => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao recuperar categorias: ' + error.error.message })
        return [];
      })
    ))

    this.category.update(atual => data.records);
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
}
