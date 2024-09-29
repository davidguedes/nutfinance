import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { CalendarModule } from 'primeng/calendar';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'app-fechamentos-filter',
  standalone: true,
  imports: [ReactiveFormsModule, AccordionModule, FloatLabelModule, CalendarModule],
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
            <div class="input-filter">
              <p-floatLabel>
                <p-calendar id="initial_date" [showIcon]="true" dateFormat="dd/mm/yy" formControlName="initial_date" (onSelect)="emitFilter()" (onClear)="emitFilter()" [showClear]="true" [maxDate]="formulario.get('final_date')?.value"></p-calendar>
                <label for="initial_date">Dt. Início Transação</label>
              </p-floatLabel>
            </div>
            <div class="input-filter">
              <p-floatLabel>
                <p-calendar id="final_date" [showIcon]="true" dateFormat="dd/mm/yy" formControlName="final_date" (onSelect)="emitFilter()" (onClear)="emitFilter()" [showClear]="true" [minDate]="formulario.get('initial_date')?.value"></p-calendar>
                <label for="final_date">Dt. Final Transação</label>
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
  styles: `
    .content-form {
      padding: 20px;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      grid-gap: 10px;
    }
  `
})
export class FechamentosFilterComponent {
  @Output() onFilter = new EventEmitter();
  formBuilder = inject(FormBuilder);
  formulario!: FormGroup;

  ngOnInit(): void {
    this.formulario = this.formBuilder.group({
      initial_date: [null],
      final_date: [null],
    })

    this.emitFilter();
  }

  clear() {
    this.formulario.reset();
    this.emitFilter();
  }

  emitFilter() {
    this.onFilter.emit(this.formulario.value);
  }
}
