import { Component, EventEmitter, Input, OnInit, Output, booleanAttribute, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TransactionForm } from '../../model/transaction.model';
import { ErroFormComponent } from '../../shared/erro-form/erro-form.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ChipsModule } from 'primeng/chips';

@Component({
  selector: 'app-transacoes-form',
  standalone: true,
  imports: [CommonModule, ButtonModule, ReactiveFormsModule, ErroFormComponent, InputTextModule, InputNumberModule, FloatLabelModule, CalendarModule, InputSwitchModule, ChipsModule],
  template: `
    <div class="cadastro-forms" style="display: flex; width: 100%; justify-content: center; flex-direction: column">
      <div class="formulario">
        <form [formGroup]="formulario" (keydown.enter)="submitForm()">
          <div class="form-input">
            <div class="input-field d-column">
              <div class="input-campos">
                <p-floatLabel [style]="{'width': '100%'}">
                  <input pInputText type="text" [style]="{'width': '100%'}" id="description" formControlName="description"/>
                  <label for="description">Descrição*</label>
                </p-floatLabel>
              </div>
              <app-erro-form class="erro-form-cadastro" [formulario]="formulario" errorText="Digite um nome válido" nameField="description"></app-erro-form>
            </div>
          </div>

          <div class="form-input">
            <div class="input-field d-column">
              <div class="input-campos">
                <p-floatLabel [style]="{'width': '100%'}">
                  <p-inputNumber styleClass="input-styling" id="value" formControlName="value" [minFractionDigits]="2" mode="currency" currency="BRL" locale="pt-BR"> </p-inputNumber>
                  <label for="value">Valor*</label>
                </p-floatLabel>
              </div>
              <app-erro-form class="erro-form-cadastro" [formulario]="formulario" errorText="Digite um nome válido" nameField="value"></app-erro-form>
            </div>
          </div>

          <div class="form-input">
            <div class="input-field">
              <div class="input-campos" style="display: flex; width: 100%; align-items:center;">
                <div class="input-name" style="padding: 13px; min-width: 30%">
                  <span>Tipo*</span>
                </div>
                <!--div class="input-switch" style="border: 1px solid #ddd; border-radius: 0px 10px 10px 0px; justify-content: space-between; padding: 6px"-->
                <div class="input-switch">
                  <p-inputSwitch formControlName="type" [falseValue]="'D'" [trueValue]="'R'"></p-inputSwitch><span [style]="{'margin-left': '5px', 'padding': '10px', 'background-color': formulario.get('type')?.value === 'R' ? '#27ff006e' : '#ff00006e', 'border-radius': '10px'}">{{formulario.get('type')?.value === 'R' ? 'Ganho' : 'Gasto'}}</span>
                </div>
              </div>
              <app-erro-form class="erro-form-cadastro" [formulario]="formulario" errorText="Digite um nome válido" nameField="type"></app-erro-form>
            </div>
          </div>

          <div class="form-input">
            <div class="input-field">
              <div class="input-campos" style="display: flex; width: 100%; align-items:center;">
                <div class="input-name" style="padding: 13px; min-width: 30%">
                  <span>Parcelado*</span>
                </div>
                <div class="inpu-switch">
                  <p-inputSwitch formControlName="isInstallment"></p-inputSwitch>
                </div>
              </div>
            </div>
          </div>

          @if(this.formulario.get('isInstallment')?.value === true){
            <div class="form-input">
              <div class="input-field d-column">
                <div class="input-campos" style="display: flex; width: 100%">
                  <p-floatLabel [style]="{'width': '100%'}">
                    <p-inputNumber styleClass="input-styling" id="totalInstallmentNumber" formControlName="totalInstallmentNumber" [showButtons]="true" [min]="2"></p-inputNumber>
                    <label for="totalInstallmentNumber">Nº Recorrência</label>
                  </p-floatLabel>
                </div>
              </div>
            </div>
          }

          @if(this.formulario.get('totalInstallmentNumber')?.value > 0) {
            <div style="margin: 0px 20px 20px 20px;">
              <div class="input-field d-column">
                <div class="input-campos" style="display: flex; width: 100%; margin: 0px 5px">
                  <span>Valor total:&nbsp;</span> <span style="font-weight: bolder">{{(this.formulario.get('value')?.value * this.formulario.get('totalInstallmentNumber')?.value) | currency:'BRL':'symbol':'1.2-2':'pt-BR'}}</span>
                </div>
              </div>
            </div>
          }

          <div class="form-input">
            <div class="input-field d-column">
              <div class="input-campos" style="display: flex; width: 100%">
                <p-floatLabel [style]="{'width': '100%'}">
                  <p-calendar [style]="{'width': '100%'}" id="date_transaction" class="calendar-cadastro" formControlName="date_transaction" [style]="{'min-width': '100%'}" appendTo="body"></p-calendar>
                  <label for="date_transaction">Dt. Transação*</label>
                </p-floatLabel>
              </div>
              <app-erro-form class="erro-form-cadastro" [formulario]="formulario" errorText="Selecione a data de admissão
              " nameField="date_transaction"></app-erro-form>
            </div>
          </div>

          <div class="form-input">
            <div class="input-field d-column">
              <div class="input-campos">
                <p-floatLabel [style]="{'width': '100%'}">
                  <p-chips styleClass="input-styling" formControlName="tags" [style]="{'width': '100%'}"></p-chips>
                  <label for="tags">Tags</label>
                </p-floatLabel>
              </div>
              <app-erro-form class="erro-form-cadastro" [formulario]="formulario" errorText="Digite um nome válido" nameField="valor"></app-erro-form>
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
export class TransacoesFormComponent implements OnInit {
  @Input({ transform: booleanAttribute }) fastForm: boolean = false;
  @Input() edit!: TransactionForm | undefined;
  @Output() onSubmit = new EventEmitter();
  @Output() closeModal = new EventEmitter<boolean>();

  formBuilder = inject(FormBuilder);
  formulario!: FormGroup;

  ngOnInit(): void {
    if(this.edit) {
      this.formulario = this.formBuilder.group({
        id: [this.edit.id, [Validators.required]],
        description: [this.edit.description, [Validators.required]],
        value: [this.edit.value, [Validators.required]],
        type: [this.edit.type, [Validators.required]],
        isInstallment: [this.edit.isInstallment, [Validators.required]],
        totalInstallmentNumber: this.edit.totalInstallmentNumber,
        date_transaction: [new Date(this.edit.date_transaction), [Validators.required]],
        tags: [this.edit.tags],
      });
    } else {
      this.formulario = this.formBuilder.group({
        description: [null, [Validators.required]],
        value: [null, [Validators.required]],
        type: ['D', [Validators.required]],
        isInstallment: [false, [Validators.required]],
        totalInstallmentNumber: [0],
        date_transaction: [null, [Validators.required]],
        tags: [[]],
      });
    }

    if(!this.fastForm) {
      //this.formulario.get('con_no_senha')?.addValidators(Validators.required)
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
