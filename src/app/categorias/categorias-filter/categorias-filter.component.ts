import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-categorias-filter',
  standalone: true,
  imports: [ReactiveFormsModule, FloatLabelModule, ButtonModule, InputTextModule],
  template: `
    <form [formGroup]="formulario">
      <div class="content-form">
        <div class="input-filter">
          <p-floatLabel>
            <input type="text" pInputText (blur)="emitFilter()" (keydown.enter)="emitFilter()" formControlName="name" inputId="name" />
            <label for="name">Nome</label>
          </p-floatLabel>
        </div>
        <div class="input-filter">
          <p-button icon="pi pi-eraser" severity="warning" [style]="{'width': '100%'}" label="Limpar" (click)="clear()"></p-button>
        </div>
      </div>
    </form>
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

    ::ng-deep .p-inputtext, ::ng-deep .p-chips {
      width: 100%;
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
export class CategoriasFilterComponent implements OnInit {
  @Output() onFilter = new EventEmitter();
  formBuilder = inject(FormBuilder);
  formulario!: FormGroup;

  ngOnInit(): void {
    this.formulario = this.formBuilder.group({
      name: [null],
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
