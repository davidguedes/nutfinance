import { Component, inject, signal } from '@angular/core';
import { FixasListComponent } from './fixas-list/fixas-list.component';
import { FixasFilterComponent } from './fixas-filter/fixas-filter.component';
import { TransacoesService } from '../transacoes/transacoes.service';
import { Fixas, FixasFilter } from './fixas.interface';
import { FixasService } from './fixas.service';
import { Paginator } from '../model/paginator.model';
import { catchError, lastValueFrom } from 'rxjs';
import { FixedForm } from '../model/fixed.model';
import { FixasModalComponent } from './fixas-modal/fixas-modal.component';
import { ButtonModule } from 'primeng/button';

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
        <app-fixas-modal (toggleVisible)="hideModal($event)" [fixedEdit]="editFixed" [visible]="modalVisible" ></app-fixas-modal>
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
  `
})
export class FixasComponent {
  protected fixedService: Fixas = inject(FixasService);
  editFixed!: FixedForm | undefined;
  modalVisible: boolean = false;
  fixed = signal<FixedForm[]>([]);
  loading: boolean = false;
  filters: FixasFilter = {} as FixasFilter;
  paginator: Paginator = { first: 0, rows: 10, total: 0 };

  async onFilter(first: number, rows: number, filters: any) {
    console.log('passou pelo onFilter')
    this.filters = filters;
    this.loading = true;
    this.paginator.first = first;
    this.paginator.rows = rows;
    const data = await lastValueFrom(this.fixedService.getFixed(first, rows, filters).pipe(
      catchError(error => {
        //this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao recuperar cadastro ' + error.error.message })
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
}
