import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { CalendarModule } from 'primeng/calendar';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ChipsModule } from 'primeng/chips';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'transacoes-filter',
  standalone: true,
  imports: [ReactiveFormsModule, CalendarModule, FloatLabelModule, ChipsModule, InputSwitchModule, ButtonModule],
  template: `
    <form [formGroup]="formulario">
      <div class="content-form">
        <div class="input-filter">
          <p-floatLabel>
            <p-calendar id="initial_date_transaction" [showIcon]="true" dateFormat="dd/mm/yy" formControlName="initial_date_transaction" (ngModelChange)="emitFilter()"></p-calendar>
            <label for="initial_date_transaction">Dt. Início Transação*</label>
          </p-floatLabel>
        </div>
        <div class="input-filter">
          <p-floatLabel>
            <p-calendar id="final_date_transaction" [showIcon]="true" dateFormat="dd/mm/yy" formControlName="final_date_transaction" (ngModelChange)="emitFilter()"></p-calendar>
            <label for="final_date_transaction">Dt. Final Transação*</label>
          </p-floatLabel>
        </div>
        <div class="input-filter">
          <p-floatLabel>
            <p-chips formControlName="tags" (ngModelChange)="emitFilter()"></p-chips>
            <label for="tags">Tags</label>
          </p-floatLabel>
        </div>
        <div class="input-filter">
          <div class="input-campos" style="display: flex; width: 100%; align-items:center;">
            <div class="input-name" style="padding: 13px; width: 30%">
              <span>Tipo*</span>
            </div>
            <div class="input-switch" style="display: flex; align-items: center; justify-content: center;">
              <p-inputSwitch formControlName="type" (ngModelChange)="emitFilter()" [falseValue]="'D'" [trueValue]="'R'"></p-inputSwitch><span [style]="{'margin-left': '5px', 'padding': '10px', 'background-color': formulario.get('type')?.value === 'R' ? '#27ff006e' : '#ff00006e', 'border-radius': '10px'}">{{formulario.get('type')?.value === 'R' ? 'Receita' : 'Despesa'}}</span>
            </div>
          </div>
        </div>
        <div class="input-filter">
          <p-button icon="pi pi-eraser" severity="warning" [style]="{'width': '100%'}" label="Limpar" (click)="formulario.reset()"></p-button>
        </div>
      </div>
    </form>
  `,
  styles: [`
    .content-form {
      padding: 10px;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr 1fr; /* Cria três colunas de larguras iguais */
      grid-gap: 10px;
    }

    .input-filter {
      width: 100%;
    }

    @media (max-width: 1340px) {
      .content-form {
        grid-template-columns: 1fr 1fr 1fr 1fr;
      }
    }

    @media (max-width: 1140px) {
      .content-form {
        grid-template-columns: 1fr 1fr 1fr;
      }
    }

    @media (max-width: 900px) {
      .content-form {
        grid-template-columns: 1fr 1fr;
      }
    }

    @media (max-width: 740px) {
      .content-form {
        grid-template-columns: 1fr;
      }
    }

  `]
})
export class TransacoesFilterComponent implements OnInit {
  @Output() onFilter = new EventEmitter();
  formBuilder = inject(FormBuilder);
  formulario!: FormGroup;

  ngOnInit(): void {
    this.formulario = this.formBuilder.group({
      initial_date_transaction: [null, [Validators.required]],
      final_date_transaction: [null, [Validators.required]],
      tags: [null, [Validators.required]],
      type: ["R", [Validators.required]],
    })

    this.emitFilter();
  }

  emitFilter() {
    console.log('this.formulario: ', this.formulario.value);
    this.onFilter.emit(this.formulario.value);
  }
}
