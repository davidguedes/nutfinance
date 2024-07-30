import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { PaginatorComponent } from '../../shared/paginator/paginator.component';
import { CategoryForm } from '../../model/category.model';
import { CategoriasDeleteComponent } from "../categorias-delete/categorias-delete.component";

@Component({
  selector: 'app-categorias-list',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, PaginatorComponent, CategoriasDeleteComponent],
  template: `
    <div class="content">
      <p-table [value]="categorias" [loading]="loading" styleClass="p-datatable-gridlines" [tableStyle]="{ 'min-width': '100%' }" responsiveLayout="stack" [breakpoint]="'960px'">
        <ng-template pTemplate="header">
          <tr>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Funções</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-categoria let-columns="columns">
          <tr>
            <td><span class="p-column-title">Nome</span>{{ categoria.name }}</td>
            <td><span class="p-column-title">Descrição</span>{{ categoria.description }}</td>
            <td>
              <span class="p-column-title">Funções</span>
              <div style="display: flex;">
                <app-categorias-delete (deleteButton)="loading = false; getCategoryList.emit(true)" [idCategory]="categoria.id" style="margin-right: 10px;" />
                <p-button [style]="{'background-color': 'orange', 'border':'orange', 'margin-right':'10px'}" (click)="editCategory.emit(categoria)" pTooltip="Editar" icon="pi pi-pencil"></p-button>
              </div>
            </td>
          </tr>
        </ng-template>
        <ng-template pTemplate="emptymessage">
          <tr>
            <td colspan="6">
              <div class="empty-list">
                <span><b>Nenhum resultado encontrado</b></span>
              </div>
            </td>
          </tr>
        </ng-template>
      </p-table>
      <app-paginator
        [rows]="paginator.rows"
        [first]="paginator.first"
        [total]="paginator.total"
        (onPageChangeEvent)="getCategoryList.emit($event)"
      />
    </div>
  `,
  styles: `
    .content {
      width: 100%;
    }
  `
})
export class CategoriasListComponent {
  @Output() getCategoryList = new EventEmitter<boolean>();
  @Output() editCategory: EventEmitter<CategoryForm> = new EventEmitter<CategoryForm>();

  @Input() categorias: CategoryForm[] = [];
  @Input() loading: boolean = false;
  @Input() paginator = {
    first: 0,
    rows: 10,
    total: 0
  }
}
