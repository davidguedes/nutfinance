import { Component, EventEmitter, Input, OnInit, Output, booleanAttribute, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TransacoesForm } from '../../model/transacoes.model';
import { ErroFormComponent } from '../../shared/erro-form/erro-form.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ChipsModule } from 'primeng/chips';

@Component({
  selector: 'app-transacoes-form',
  standalone: true,
  imports: [ButtonModule, ReactiveFormsModule, ErroFormComponent, InputTextModule, InputNumberModule, FloatLabelModule, CalendarModule, InputSwitchModule, ChipsModule],
  template: `
    <div class="cadastro-forms" style="display: flex; width: 100%; justify-content: center; flex-direction: column">
      <div class="formulario" style="width: 100%;">
        <form [formGroup]="formulario">
          <div class="form-input">
            <div class="input-field d-column">
              <div class="input-campos" style="display: flex; width: 100%">
                <p-floatLabel>
                  <input pInputText type="text" id="descricao" formControlName="descricao" />
                  <label for="descricao">Descrição*</label>
                </p-floatLabel>
              </div>
              <app-erro-form class="erro-form-cadastro" [formulario]="formulario" errorText="Digite um nome válido" nameField="valor"></app-erro-form>
            </div>
          </div>

          <div class="form-input">
            <div class="input-field d-column">
              <div class="input-campos" style="display: flex; width: 100%">
                <p-floatLabel>
                  <p-inputNumber id="valor" formControlName="valor" [minFractionDigits]="2" mode="currency" currency="BRL" locale="pt-BR"> </p-inputNumber>
                  <label for="valor">Valor*</label>
                </p-floatLabel>
              </div>
              <app-erro-form class="erro-form-cadastro" [formulario]="formulario" errorText="Digite um nome válido" nameField="valor"></app-erro-form>
            </div>
          </div>

          <div class="form-input">
            <div class="input-field">
              <div class="input-campos" style="display: flex; width: 100%; align-items:center;">
                <div class="input-name" style="padding: 13px; width: 30%">
                  <span>Tipo*</span>
                </div>
                <!--div class="input-switch" style="border: 1px solid #ddd; border-radius: 0px 10px 10px 0px; justify-content: space-between; padding: 6px"-->
                <div class="input-switch">
                  <p-inputSwitch formControlName="tipo" [falseValue]="'D'" [trueValue]="'R'"></p-inputSwitch><span [style]="{'margin-left': '5px', 'padding': '10px', 'background-color': formulario.get('tipo')?.value === 'R' ? '#27ff006e' : '#ff00006e', 'border-radius': '10px'}">{{formulario.get('tipo')?.value === 'R' ? 'Receita' : 'Despesa'}}</span>
                </div>
              </div>
              <app-erro-form class="erro-form-cadastro" [formulario]="formulario" errorText="Digite um nome válido" nameField="tipo"></app-erro-form>
            </div>
          </div>

          <div class="form-input">
            <div class="input-field">
              <div class="input-campos" style="display: flex; width: 100%; align-items:center;">
                <div class="input-name" style="padding: 13px; width: 30%">
                  <span>Recorrência*</span>
                </div>
                <div class="inpu-switch">
                  <p-inputSwitch formControlName="recorrencia"></p-inputSwitch>
                </div>
              </div>
            </div>
          </div>

          @if(this.formulario.get('recorrencia')?.value === true){
            <div class="form-input">
              <div class="input-field d-column">
                <div class="input-campos" style="display: flex; width: 100%">
                  <p-floatLabel>
                    <p-inputNumber id="numero_recorrencia" formControlName="numero_recorrencia" [showButtons]="true" [min]="0"></p-inputNumber>
                    <label for="numero_recorrencia">Nº Recorrência</label>
                  </p-floatLabel>
                </div>
              </div>
            </div>
          }

          <div class="form-input">
            <div class="input-field d-column">
              <div class="input-campos" style="display: flex; width: 100%">
                <p-floatLabel>
                  <p-calendar id="data_transacao" class="calendar-cadastro" formControlName="data_transacao" [style]="{'min-width': '100%'}" appendTo="body"></p-calendar>
                  <label for="data_transacao">Dt. Transação*</label>
                </p-floatLabel>
              </div>
              <app-erro-form class="erro-form-cadastro" [formulario]="formulario" errorText="Selecione a data de admissão
              " nameField="data_transacao"></app-erro-form>
            </div>
          </div>

          <div class="form-input">
            <div class="input-field d-column">
              <div class="input-campos" style="display: flex; width: 100%">
                <p-floatLabel>
                  <p-chips formControlName="tags"></p-chips>
                  <label for="tags">Tags</label>
                </p-floatLabel>
              </div>
              <app-erro-form class="erro-form-cadastro" [formulario]="formulario" errorText="Digite um nome válido" nameField="valor"></app-erro-form>
            </div>
          </div>
        </form>
        <div class="buttons-form" [style]="{'display': 'flex'}">
          <div class="button" [style]="{'width': '33%', 'margin': '5px'}"><p-button icon="pi pi-check" [style]="{'width': '100%', 'background-color':'#2196F3', 'border': '1px solid #2196F3'}" label="Salvar" (click)="submitForm()"></p-button></div>

          <div class="button" [style]="{'width': '33%', 'margin': '5px'}"><p-button icon="pi pi-eraser" [style]="{'width': '100%', 'background-color':'#fab710', 'border': '1px solid #fab710'}" label="Limpar" (click)="clear()"></p-button></div>

          <div class="button" [style]="{'width': '33%', 'margin': '5px'}"><p-button icon="pi pi-times" [style]="{'width': '100%', 'background-color':'#D32F2F', 'border': '1px solid #D32F2F'}" label="Cancelar" (click)="close()"></p-button></div>
        </div>
      </div>
    </div>
  `,
  styles: `
    .form-input {
      padding: 20px;
    }

    .input-switch {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `
})
export class TransacoesFormComponent implements OnInit {
  @Input({ transform: booleanAttribute }) fastForm: boolean = false;
  @Input() new: TransacoesForm = {} as TransacoesForm;
  @Input() edit!: TransacoesForm;
  @Output() onSubmit = new EventEmitter();
  @Output() closeModal = new EventEmitter<boolean>();

  formBuilder = inject(FormBuilder);
  formulario!: FormGroup;

  ngOnInit(): void {
    if(this.edit) {
      this.formulario = this.formBuilder.group({
        descricao: [this.edit.descricao, [Validators.required]],
        valor: [this.edit.valor, [Validators.required]],
        tipo: [this.edit.tipo, [Validators.required]],
        recorrencia: [this.edit.recorrencia, [Validators.required]],
        numero_recorrencia: this.edit.numero_recorrencia,
        data_transacao: [new Date(this.edit.data_transacao), [Validators.required]],
        tags: [this.edit.tags],
      });
    } else {
      this.formulario = this.formBuilder.group({
        descricao: [null, [Validators.required]],
        valor: [null, [Validators.required]],
        tipo: ['D', [Validators.required]],
        recorrencia: [false, [Validators.required]],
        numero_recorrencia: [0],
        data_transacao: [null, [Validators.required]],
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
