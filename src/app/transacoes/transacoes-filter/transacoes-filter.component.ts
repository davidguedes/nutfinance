import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { CalendarModule } from 'primeng/calendar';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ChipsModule } from 'primeng/chips';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TriStateCheckboxModule } from 'primeng/tristatecheckbox';
import { AccordionModule } from 'primeng/accordion';

@Component({
  selector: 'transacoes-filter',
  standalone: true,
  imports: [TriStateCheckboxModule, ReactiveFormsModule, CalendarModule, FloatLabelModule, ChipsModule, InputSwitchModule, ButtonModule, AccordionModule],
  template: `
    <p-accordion class="w-full" expandIcon="pi pi-search-plus" collapseIcon="pi pi-search-minus">
      <p-accordionTab>
        <ng-template pTemplate="header">
          <span class="flex align-items-center gap-2 w-full">
            <span class="font-bold white-space-nowrap">
              Filtro
            </span>
          </span>
        </ng-template>
        <form [formGroup]="formulario">
          <div class="content-form">
            <div class="input-campos" style="display: flex; width: 100%; align-items:center; justify-content: center;">
              <span
                (click)="formulario.get('sort')?.setValue(formulario.get('sort')?.value === true || formulario.get('sort')?.value === null ? false : true); emitFilter()"
                [class]="formulario.get('sort')?.value || formulario.get('sort')?.value === null ? 'pi pi-sort-amount-down' : 'pi pi-sort-amount-up'"
                style="cursor: pointer;"
                inputId="sort"
              ></span>
              <label (click)="formulario.get('sort')?.setValue(formulario.get('sort')?.value === true || formulario.get('sort')?.value === null ? false : true); emitFilter()" for="sort" style="cursor: pointer;">
                {{formulario.get('sort')?.value || formulario.get('sort')?.value === null ? 'Decrescente' : 'Crescente'}}
              </label>
            </div>
            <div class="input-filter">
              <div class="input-campos" style="display: flex; width: 100%; align-items:center; justify-content: center;">
                <div class="input-name" style="padding: 13px; width: 30%">
                  <span>Tipo</span>
                </div>
                <div class="input-switch" style="display: flex; align-items: center; justify-content: center;">
                  <p-triStateCheckbox formControlName="type" (onChange)="emitFilter()" inputId="type" />
                  <label for="type">
                    <span [style]="{'margin-left': '10px', 'padding': '10px', 'background-color': formulario.get('type')?.value === null ? '#0ea5e96e' : formulario.get('type')?.value === true ? '#27ff006e' : '#ff00006e', 'border-radius': '10px'}">{{ formulario.value.type === null ? 'Todos' : formulario.value.type === true ? 'Ganhos' : 'Gastos'}}</span>
                  </label>
                  <!--p-inputSwitch formControlName="types" (ngModelChange)="emitFilter()" [falseValue]="'D'" [trueValue]="'R'"></p-inputSwitch><span [style]="{'margin-left': '5px', 'padding': '10px', 'background-color': formulario.get('types')?.value === 'R' ? '#27ff006e' : '#ff00006e', 'border-radius': '10px'}">{{formulario.get('types')?.value === 'R' ? 'Ganho' : 'Gasto'}}</span-->
                </div>
              </div>
            </div>
            <div class="input-filter">
              <p-floatLabel>
                <p-calendar id="initial_date_transaction" [showIcon]="true" dateFormat="dd/mm/yy" formControlName="initial_date_transaction" (onSelect)="emitFilter()" (onClear)="emitFilter()" [showClear]="true" [maxDate]="formulario.get('final_date_transaction')?.value"></p-calendar>
                <label for="initial_date_transaction">Dt. Início Transação</label>
              </p-floatLabel>
            </div>
            <div class="input-filter">
              <p-floatLabel>
                <p-calendar id="final_date_transaction" [showIcon]="true" dateFormat="dd/mm/yy" formControlName="final_date_transaction" (onSelect)="emitFilter()" (onClear)="emitFilter()" [showClear]="true" [minDate]="formulario.get('initial_date_transaction')?.value"></p-calendar>
                <label for="final_date_transaction">Dt. Final Transação</label>
              </p-floatLabel>
            </div>
            <div class="input-filter">
              <p-floatLabel>
                <p-chips formControlName="tags" (onAdd)="emitFilter()" (onRemove)="emitFilter()" (onClear)="emitFilter()" [showClear]="true"></p-chips>
                <label for="tags">Tags</label>
              </p-floatLabel>
            </div>
            <div class="input-filter">
              <p-button icon="pi pi-eraser" severity="warning" [style]="{'width': '100%'}" label="Limpar" (click)="clear()"></p-button>
            </div>
          </div>
        </form>
      </p-accordionTab>
    </p-accordion>
  `,
  styles: [`
    .content-form {
      padding: 20px;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr; /* Cria três colunas de larguras iguais */
      grid-gap: 10px;
    }

    .input-filter {
      width: 100%;
    }

    ::ng-deep .p-inputtext, ::ng-deep .p-chips, ::ng-deep span.p-calendar {
      width: 100%!important;
    }

    @media (max-width: 1580px) {
      .content-form {
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
      }
    }

    @media (max-width: 1360px) {
      .content-form {
        grid-template-columns: 1fr 1fr 1fr 1fr;
      }
    }

    @media (max-width: 1120px) {
      .content-form {
        grid-template-columns: 1fr 1fr 1fr;
      }
    }

    @media (max-width: 920px) {
      .content-form {
        grid-template-columns: 1fr 1fr;
      }
    }

    @media (max-width: 640px) {
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
  maxDate: Date;
  today: Date;

  constructor() {
    const today = new Date();
    this.today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    this.maxDate = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Último dia do mês atual
  }

  ngOnInit(): void {
    this.formulario = this.formBuilder.group({
      initial_date_transaction: [null, [Validators.required]],
      final_date_transaction: [null, [Validators.required]],
      tags: [null, [Validators.required]],
      type: [null],
      sort: [true],
    }, { validator: this.dateRangeValidator })

    this.emitFilter();
  }

  dateRangeValidator(group: FormGroup) {
    const initialDate = group.get('initial_date_transaction')?.value;
    const finalDate = group.get('final_date_transaction')?.value;
    return initialDate && finalDate && initialDate > finalDate ? { dateRangeInvalid: true } : null;
  }

  clear() {
    this.formulario.reset();
    this.emitFilter();
  }

  emitFilter() {
    this.onFilter.emit(this.formulario.value);
  }
}
