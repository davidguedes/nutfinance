import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ClosureForm } from '../../model/closure.model';
import { PaginatorComponent } from '../../shared/paginator/paginator.component';

@Component({
  selector: 'app-fechamentos-list',
  standalone: true,
  imports: [CommonModule, TableModule, PaginatorComponent],
  template: `
    <div class="content">
      <p-table [value]="fechamentos" [loading]="loading" styleClass="p-datatable-gridlines" responsiveLayout="stack" [breakpoint]="'960px'" [tableStyle]="{'min-width': '100%'}" [scrollable]="false">
        <ng-template pTemplate="header">
          <tr>
            <th>Período</th>
            <th>Ganho</th>
            <th>Gasto</th>
            <th>Sobra</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-fechamento let-columns="columns">
          <tr>
            <td style="white-space: normal"><span class="p-column-title">Período</span>{{ fechamento.initialDate | date:'dd/MM/yyyy' }} - {{ fechamento.finalDate | date:'dd/MM/yyyy' }}</td>
            <td style="white-space: normal"><span class="p-column-title">Ganhos</span>{{ fechamento.balance | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</td>
            <td style="white-space: normal"><span class="p-column-title">Gastos</span>{{ fechamento.spending | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</td>
            <td style="white-space: normal"><span class="p-column-title">Sobra</span>{{ (fechamento.balance - fechamento.spending) | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</td>
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
        (onPageChangeEvent)="getClosureList.emit($event)"
      />
    </div>
  `,
  styles: ``
})
export class FechamentosListComponent {
  @Output() getClosureList = new EventEmitter<boolean>();

  @Input() fechamentos: ClosureForm[] = [];
  @Input() loading: boolean = false;
  @Input() paginator = {
    first: 0,
    rows: 10,
    total: 0
  }
}
