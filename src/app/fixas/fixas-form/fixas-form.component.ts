import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ErroFormComponent } from '../../shared/erro-form/erro-form.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ChipsModule } from 'primeng/chips';
import { FixedForm } from '../../model/fixed.model';
import { catchError, lastValueFrom } from 'rxjs';
import { OrcamentosService } from '../../orcamentos/orcamentos.service';
import { Orcamentos } from '../../orcamentos/orcamentos.interface';
import { LoginService } from '../../login/login.service';
import { UserForm } from '../../model/user.model';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-fixas-form',
  standalone: true,
  imports: [CommonModule, ButtonModule, ReactiveFormsModule, ErroFormComponent, InputTextModule, InputNumberModule, FloatLabelModule, CalendarModule, InputSwitchModule, ChipsModule, DropdownModule],
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
            <div class="input-field d-column">
              <div class="input-campos" style="display: flex; width: 100%">
                <p-floatLabel [style]="{'width': '100%'}">
                  <p-inputNumber styleClass="input-styling" id="day_inclusion" formControlName="day_inclusion" [min]="1" [max]="28"> </p-inputNumber>
                  <label for="day_inclusion">Dia Inclusão*</label>
                </p-floatLabel>
              </div>
              <app-erro-form class="erro-form-cadastro" [formulario]="formulario" errorText="Selecione o dia de inclusão
              " nameField="day_inclusion"></app-erro-form>
            </div>
          </div>

          <div class="form-input">
            <div class="input-field d-column">
              <div class="input-campos">
                <p-dropdown
                  formControlName="category"
                  [options]="formulario.get('type')?.value === 'R' ? categorias.income : categorias.expense"
                  optionLabel="category"
                  optionValue="id"
                  placeholder="Selecione uma categoria" />
              </div>
              <app-erro-form class="erro-form-cadastro" [formulario]="formulario" errorText="Selecione uma categoria" nameField="category"></app-erro-form>
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
          <div class="button"><p-button icon="pi pi-check" [disabled]="disabled" [style]="{'width': '100%', 'background-color':'#2196F3', 'border': '1px solid #2196F3'}" label="Salvar" (click)="submitForm()"></p-button></div>

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

    p-dropdown {
      width: 100%!important;
    }

    ::ng-deep div.p-dropdown {
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
export class FixasFormComponent implements OnInit {
  protected budgetService: Orcamentos = inject(OrcamentosService);
  protected authService: any = inject(LoginService);
  private user: UserForm = {} as UserForm;

  @Input() edit!: FixedForm | undefined;
  @Output() onSubmit = new EventEmitter();
  @Output() closeModal = new EventEmitter<boolean>();
  @Input() categorias: any = {
    expense: [],
    income: []
  };
  @Input() disabled: boolean = false;

  formBuilder = inject(FormBuilder);
  formulario!: FormGroup;

  ngOnInit(): void {
    this.user = this.authService.getUser();
    if(this.categorias.length == 0)
      this.getCategorias();

    if(this.edit) {
      this.formulario = this.formBuilder.group({
        id: [this.edit.id, [Validators.required]],
        description: [this.edit.description, [Validators.required]],
        value: [this.edit.value, [Validators.required]],
        type: [this.edit.type, [Validators.required]],
        day_inclusion: [this.edit.day_inclusion, [Validators.required]],
        category: [this.edit.budgetCategory_id, [Validators.required]],
        tags: [this.edit.tags],
      });
    } else {
      this.formulario = this.formBuilder.group({
        description: [null, [Validators.required]],
        value: [null, [Validators.required]],
        type: ['D', [Validators.required]],
        day_inclusion: [null, [Validators.required]],
        category: [null, [Validators.required]],
        tags: [[]],
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

  async getCategorias() {
    const categorias: any[] = await lastValueFrom(this.budgetService.getCategory(this.user.id).pipe(
      catchError(error => {
        console.log('Error: ', error.message);
        //this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao recuperar cadastro ' + error.error.message })
        return [];
      })
    ));

    if(categorias.length > 0) {
      this.categorias.income = categorias.filter(cat => cat.type == 'income') ?? [];
      this.categorias.expense = categorias.filter(cat => cat.type == 'expense') ?? [];
    } else
      this.categorias = [];
  }
}
