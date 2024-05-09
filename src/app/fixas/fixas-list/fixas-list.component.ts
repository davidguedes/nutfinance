import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TableModule } from 'primeng/table';
import { FixedForm } from '../../model/fixed.model';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-fixas-list',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule],
  template: `
    <div class="card flex justify-content-center">
      <p-table [value]="fixas" [loading]="loading" styleClass="p-datatable-gridlines" [tableStyle]="{ 'min-width': '100%' }" responsiveLayout="stack" [breakpoint]="'960px'">
        <ng-template pTemplate="header">
          <tr>
            <th>Descrição</th>
            <th>Valor</th>
            <th>Tipo</th>
            <th>Dt. Lançamento</th>
            <th>Status</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-usuario let-columns="columns">
          <tr>
            <td><span class="p-column-title">Descrição</span>{{ usuario.con_co_cnpj == -1 ? 'Sem empresa vinculada' : usuario.con_co_cnpj + ' - ' + usuario.option_label }}</td>
            <td><span class="p-column-title">Valor</span>{{ usuario.usu_no_usuario }}</td>
            <td><span class="p-column-title">Tipo</span>{{ usuario.usu_no_email }}</td>
            <td><span class="p-column-title">Dt. Lançamento</span>{{ usuario.usu_in_status == 'A'? 'Ativo': 'Inativo'}}</td>
            <td>
              <span class="p-column-title">Funções</span>
              <div style="display: flex;">
                <p-button [style]="{'background-color': 'orange', 'border':'orange', 'margin-right':'10px'}" pTooltip="Editar" icon="pi pi-pencil"></p-button>
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
    </div>
  `,
  styles: ``
})
export class FixasListComponent {
  @Input() fixas: FixedForm[] = [];
  @Input() loading: boolean = false;

}
