import { Component } from '@angular/core';
import { CalendarModule } from 'primeng/calendar';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'transacoes-filter',
  standalone: true,
  imports: [CalendarModule, FloatLabelModule],
  template: `
    <div class="content">
      <p-floatLabel>
        <p-calendar id="data_transacao" [showIcon]="true" dateFormat="dd/mm/yy"></p-calendar>
        <label for="data_transacao">Dt. Transação*</label>
      </p-floatLabel>
    </div>
  `,
  styles: [`
    .content {
      padding: 10px;
    }
  `]
})
export class TransacoesFilterComponent {

}
