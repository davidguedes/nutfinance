import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { CategoryForm } from '../../model/category.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ErroFormComponent } from '../../shared/erro-form/erro-form.component';

@Component({
  selector: 'app-categorias-form',
  standalone: true,
  imports: [CommonModule, ButtonModule, ReactiveFormsModule, ErroFormComponent, InputTextModule, FloatLabelModule],
  template: `
    <div class="cadastro-forms" style="display: flex; width: 100%; justify-content: center; flex-direction: column">
      <div class="formulario">
        <form [formGroup]="formulario" (keydown.enter)="submitForm()">
          <div class="form-input">
            <div class="input-field d-column">
              <div class="input-campos">
                <p-floatLabel [style]="{'width': '100%'}">
                  <input pInputText type="text" [style]="{'width': '100%'}" id="name" formControlName="name"/>
                  <label for="name">Name*</label>
                </p-floatLabel>
              </div>
              <app-erro-form class="erro-form-cadastro" [formulario]="formulario" errorText="Digite um nome válido" nameField="name"></app-erro-form>
            </div>
          </div>
          <div class="form-input">
            <div class="input-field d-column">
              <div class="input-campos">
                <p-floatLabel [style]="{'width': '100%'}">
                  <input pInputText type="text" [style]="{'width': '100%'}" id="description" formControlName="description"/>
                  <label for="description">Descrição</label>
                </p-floatLabel>
              </div>
              <app-erro-form class="erro-form-cadastro" [formulario]="formulario" errorText="Digite uma descrição válida" nameField="description"></app-erro-form>
            </div>
          </div>
        </form>
        <div class="buttons-form">
          <div class="button"><p-button icon="pi pi-check" [style]="{'width': '100%', 'background-color':'#2196F3', 'border': '1px solid #2196F3'}" label="Salvar" (click)="submitForm()"></p-button></div>

          <div class="button"><p-button icon="pi pi-eraser" [style]="{'width': '100%', 'background-color':'#fab710', 'border': '1px solid #fab710'}" label="Limpar" (click)="clear()"></p-button></div>

          <div class="button"><p-button icon="pi pi-times" [style]="{'width': '100%', 'background-color':'#D32F2F', 'border': '1px solid #D32F2F'}" label="Cancelar" (click)="close()"></p-button></div>
        </div>
      </div>
    </div>
  `,
  styles: `
    p-inputNumber {
      width: 100%!important;
    }

    ::ng-deep span.input-styling.p-inputnumber.p-component {
      width: 100%!important;
    }

    ::ng-deep ul.p-inputtext.p-chips-multiple-container {
      width: 100%!important;
    }

    .form-input {
      padding: 20px;
      width: 100%;
    }

    .input-campos {
      display: flex;
      width: 100%;
    }

    .input-switch {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .buttons-form {
      display: grid;
      grid-gap: 10px;
      grid-template-columns: 1fr 1fr 1fr;
    }

    @media (max-width: 860px) {
      .buttons-form {
        grid-template-columns: 1fr 1fr;
      }
    }

    @media (max-width: 600px) {
      .buttons-form {
        grid-template-columns: 1fr;
      }
    }
  `
})
export class CategoriasFormComponent implements OnInit {
  @Input() edit!: CategoryForm | undefined;
  @Output() onSubmit = new EventEmitter();
  @Output() closeModal = new EventEmitter<boolean>();

  formBuilder = inject(FormBuilder);
  formulario!: FormGroup;

  ngOnInit(): void {
    if(this.edit) {
      this.formulario = this.formBuilder.group({
        id: [this.edit.id, [Validators.required]],
        name: [this.edit.name, [Validators.required]],
        description: [this.edit.description],
      });
    } else {
      this.formulario = this.formBuilder.group({
        name: [null, [Validators.required]],
        description: [null],
      });
    }
  }

  submitForm() {
    if(this.formulario.valid) {
      this.onSubmit.emit(this.formulario.value);
    } else {
      Object.keys(this.formulario.controls).forEach((campo) => {
        const controle = this.formulario.get(campo);
        controle?.markAsDirty();
        controle?.markAsTouched();
      })
    }
  }

  clear() {
    this.formulario.reset();
  }

  close() {
    this.clear();
    this.closeModal.emit(true);
  }
}
