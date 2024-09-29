import { Component, inject, signal } from '@angular/core';
import { LoginService } from '../login/login.service';
import { FechamentosService } from './fechamentos.service';
import { UserForm } from '../model/user.model';
import { Fechamentos, ClosuresFilter } from './fechamentos.interface';
import { FechamentosFilterComponent } from './fechamentos-filter/fechamentos-filter.component';
import { FechamentosListComponent } from './fechamentos-list/fechamentos-list.component';
import { ClosureForm } from '../model/closure.model';
import { Paginator } from '../model/paginator.model';
import { catchError, lastValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-fechamentos',
  standalone: true,
  imports: [FechamentosFilterComponent, FechamentosListComponent],
  template: `
    <div>
      <app-fechamentos-filter (onFilter)="onFilter(0, paginator.rows, $event)"></app-fechamentos-filter>
      <app-fechamentos-list [fechamentos]="closures()" [paginator]="paginator" [loading]="loading" (getFixedList)="onFilter(paginator.first, paginator.rows, filters)"></app-fechamentos-list>
    </div>
  `,
  styles: ``,
  providers: [MessageService]
})
export class FechamentosComponent {
  private user: UserForm = {} as UserForm;
  protected closuresService: Fechamentos = inject(FechamentosService);
  protected authService: any = inject(LoginService);

  closures = signal<ClosureForm[]>([]);
  loading: boolean = false;
  filters: ClosuresFilter = {} as ClosuresFilter;
  paginator: Paginator = { first: 0, rows: 10, total: 0 };
  protected messageService: any = inject(MessageService);

  ngOnInit(): void {
    this.user = this.authService.getUser();
  }

  async onFilter(first: number, rows: number, filters: any) {
    this.filters = filters;
    this.loading = true;
    this.paginator.first = first;
    this.paginator.rows = rows;
    const data = await lastValueFrom(this.closuresService.getClosures(first, rows, filters, this.user.id).pipe(
      catchError(error => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao recuperar fechamentos: ' + error.error.message })
        return [];
      })
    ))

    this.closures.update(atual => data.records);
    this.paginator.total = data.totalRecords;
    this.loading = false;
  }
}
