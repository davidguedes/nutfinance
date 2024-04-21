import { Component } from '@angular/core';
import { TransacoesListComponent } from './transacoes-list/transacoes-list.component';
import { TransacoesFilterComponent } from './transacoes-filter/transacoes-filter.component';

@Component({
  selector: 'app-transacoes',
  standalone: true,
  imports: [TransacoesListComponent, TransacoesFilterComponent],
  template: `
    <div>
      <transacoes-filter></transacoes-filter>
      <transacoes-list></transacoes-list>
    </div>
  `,
  styles: [``]
})
export class TransacoesComponent {

}
