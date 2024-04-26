import { Component, OnInit, inject } from '@angular/core';
import { CalendarModule } from 'primeng/calendar';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ChipsModule } from 'primeng/chips';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'transacoes-filter',
  standalone: true,
  imports: [ReactiveFormsModule, CalendarModule, FloatLabelModule, ChipsModule, InputSwitchModule],
  template: `
    <form [formGroup]="formulario">
      <div class="content-form">
        <div class="input-filter">
          <p-floatLabel>
            <p-calendar id="date_transaction" wi [showIcon]="true" dateFormat="dd/mm/yy" formControlName="date_transaction"></p-calendar>
            <label for="date_transaction">Dt. Transação*</label>
          </p-floatLabel>
        </div>
        <div class="input-filter">
          <p-floatLabel>
            <p-chips formControlName="tags"></p-chips>
            <label for="tags">Tags</label>
          </p-floatLabel>
        </div>
        <div class="input-filter">
          <div class="input-campos" style="display: flex; width: 100%; align-items:center;">
            <div class="input-name" style="padding: 13px; width: 30%">
              <span>Tipo*</span>
            </div>
            <div class="input-switch" style="display: flex; align-items: center; justify-content: center;">
              <p-inputSwitch formControlName="type" [falseValue]="'D'" [trueValue]="'R'"></p-inputSwitch><span [style]="{'margin-left': '5px', 'padding': '10px', 'background-color': formulario.get('type')?.value === 'R' ? '#27ff006e' : '#ff00006e', 'border-radius': '10px'}">{{formulario.get('type')?.value === 'R' ? 'Receita' : 'Despesa'}}</span>
            </div>
          </div>
        </div>
      </div>
    </form>
  `,
  styles: [`
    .content-form {
      padding: 10px;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr; /* Cria três colunas de larguras iguais */
      grid-gap: 10px;
    }

    .input-filter {
      width: 100%;
    }

    @media (max-width: 860px) {
      .content-form {
        grid-template-columns: 1fr 1fr;
      }
    }

    @media (max-width: 600px) {
      .content-form {
        grid-template-columns: 1fr;
      }
    }

  `]
})
export class TransacoesFilterComponent implements OnInit {
  formBuilder = inject(FormBuilder);
  formulario!: FormGroup;

  ngOnInit(): void {
    this.formulario = this.formBuilder.group({
      date_transaction: [null, [Validators.required]],
      tags: [null, [Validators.required]],
      type: ["R", [Validators.required]],
    })
  }
}
