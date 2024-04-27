import { Component } from '@angular/core';
import { DespesasListComponent } from './despesas-list/despesas-list.component';

@Component({
  selector: 'app-despesas',
  standalone: true,
  imports: [DespesasListComponent],
  template: `
    <app-despesas-list/>
  `,
  styles: ``
})
export class DespesasComponent {

}
