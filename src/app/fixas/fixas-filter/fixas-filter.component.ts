import { Component, EventEmitter, Output, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { ChipsModule } from 'primeng/chips';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { TriStateCheckboxModule } from 'primeng/tristatecheckbox';

@Component({
  selector: 'app-fixas-filter',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, InputTextModule, FloatLabelModule, ChipsModule, InputSwitchModule, TriStateCheckboxModule, AccordionModule],
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
                <input type="text" pInputText (blur)="emitFilter()" (keydown.enter)="emitFilter()" formControlName="description" inputId="description" />
                <label for="description">Descrição</label>
              </p-floatLabel>
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
                </div>
              </div>
            </div>
            <div class="input-filter">
              <p-floatLabel>
                <p-chips formControlName="tags" (onAdd)="emitFilter()" (onRemove)="emitFilter()" (onClear)="emitFilter()" [showClear]="true"></p-chips>
                <label for="tags">Tags</label>
              </p-floatLabel>
            </div>
            <div class="input-filter">
              <div class="input-campos" style="display: flex; width: 100%; align-items:center; justify-content: center;">
                <div class="input-name" style="padding: 13px; width: 30%">
                  <span>Status</span>
                </div>
                <div class="input-switch" style="display: flex; align-items: center; justify-content: center;">
                  <p-triStateCheckbox formControlName="status" (onChange)="emitFilter()" inputId="status" />
                  <label for="status">
                    <span [style]="{'margin-left': '10px', 'padding': '10px', 'background-color': formulario.get('status')?.value === null ? '#0ea5e96e' : formulario.get('status')?.value === true ? '#27ff006e' : '#ff00006e', 'border-radius': '10px'}">{{ formulario.value.status === null ? 'Todos' : formulario.value.status === true ? 'Ativos' : 'Inativos'}}</span>
                  </label>
                </div>
              </div>
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
      grid-template-columns: 1fr 1fr 1fr 1fr 1fr; /* Cria três colunas de larguras iguais */
      grid-gap: 10px;
    }

    .input-filter {
      width: 100%;
    }

    ::ng-deep .p-inputtext, ::ng-deep .p-chips, ::ng-deep span.p-calendar {
      width: 100%!important;
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
  `
})
export class FixasFilterComponent {
  @Output() onFilter = new EventEmitter();
  formBuilder = inject(FormBuilder);
  formulario!: FormGroup;

  ngOnInit(): void {
    this.formulario = this.formBuilder.group({
      description: [null],
      type: [null],
      tags: [null],
      status: [null],
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
