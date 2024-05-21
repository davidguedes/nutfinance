import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TableModule } from 'primeng/table';
import { FixedForm } from '../../model/fixed.model';
import { ButtonModule } from 'primeng/button';
import { PaginatorComponent } from '../../shared/paginator/paginator.component';
import { FixasModalComponent } from '../fixas-modal/fixas-modal.component';
import { FixasDeleteComponent } from '../fixas-delete/fixas-delete.component';

@Component({
  selector: 'app-fixas-list',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, PaginatorComponent, FixasModalComponent, FixasDeleteComponent],
  template: `
    <div class="content">
      <p-table [value]="fixas" [loading]="loading" styleClass="p-datatable-gridlines" [tableStyle]="{ 'min-width': '100%' }" responsiveLayout="stack" [breakpoint]="'960px'">
        <ng-template pTemplate="header">
          <tr>
            <th>Descrição</th>
            <th>Valor</th>
            <th>Tipo</th>
            <th>Dt. Lançamento</th>
            <th>Status</th>
            <th>Funções</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-fixa let-columns="columns">
          <tr>
            <td><span class="p-column-title">Descrição</span>{{ fixa.description }}</td>
            <td><span class="p-column-title">Valor</span>{{ fixa.value | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</td>
            <td><span class="p-column-title">Tipo</span>{{ fixa.type == 'D' ? 'Gasto' : 'Ganho' }}</td>
            <td><span class="p-column-title">Dia Inclusão</span>{{ fixa.day_inclusion }}</td>
            <td><span class="p-column-title">Status</span>{{ fixa.status == true ? 'Ativo' : 'Inativo' }}</td>
            <td>
              <span class="p-column-title">Funções</span>
              <div style="display: flex;">
                <app-fixas-delete (deleteButton)="loading = false; getFixedList.emit(true)" [idFixed]="fixa.id" style="margin-right: 10px;" />
                <p-button [style]="{'background-color': 'orange', 'border':'orange', 'margin-right':'10px'}" (click)="editFixed.emit(fixa)" pTooltip="Editar" icon="pi pi-pencil"></p-button>
              </div>
            </td>
          </tr>
        </ng-template>
        <ng-template pTemplate="emptymessage">
          <tr>
            <td colspan="5">
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
        (onPageChangeEvent)="getFixedList.emit($event)"
      />
    </div>
  `,
  styles: `
    .content {
      width: 100%;
    }
  `
})
export class FixasListComponent {
  @Output() getFixedList = new EventEmitter<boolean>();
  @Output() editFixed: EventEmitter<FixedForm> = new EventEmitter<FixedForm>();

  @Input() fixas: FixedForm[] = [];
  @Input() loading: boolean = false;
  @Input() paginator = {
    first: 0,
    rows: 10,
    total: 0
  }
}
