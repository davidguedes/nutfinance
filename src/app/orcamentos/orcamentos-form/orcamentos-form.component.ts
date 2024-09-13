import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ColorPickerModule } from 'primeng/colorpicker';
import { InputTextModule } from 'primeng/inputtext';
import { ErroFormComponent } from '../../shared/erro-form/erro-form.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { AccordionModule } from 'primeng/accordion';
import { UserForm } from '../../model/user.model';
import { LoginService } from '../../login/login.service';
import { OrcamentosService } from '../orcamentos.service';
import { Orcamentos } from '../orcamentos.interface';
import { catchError, lastValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-orcamentos-form',
  standalone: true,
  imports: [CommonModule, ButtonModule, ReactiveFormsModule, ErroFormComponent, InputTextModule, FloatLabelModule, InputNumberModule, CalendarModule, AccordionModule, ColorPickerModule, ToastModule, TagModule],
  template: `
    <div class="cadastro-forms" style="display: flex; width: 100%; justify-content: center; flex-direction: column">
      <div class="formulario">
        <form [formGroup]="formulario" (keydown.enter)="submitForm()">
          <div class="form-input">
            <div class="input-field d-column">
              <div class="input-campos">
                <p-floatLabel [style]="{'width': '100%'}">
                  <p-inputNumber [disabled]="true" styleClass="input-styling" id="totalExpense" formControlName="totalExpense" [minFractionDigits]="2" mode="currency" currency="BRL" locale="pt-BR"> </p-inputNumber>
                  <label for="totalExpense">Total Gastos*</label>
                </p-floatLabel>
              </div>
              <app-erro-form class="erro-form-cadastro" [formulario]="formulario" errorText="Digite o total de gastos planejados" nameField="totalExpense"></app-erro-form>
            </div>
          </div>
          <div class="form-input">
            <div class="input-field d-column">
              <div class="input-campos">
                <p-floatLabel [style]="{'width': '100%'}">
                  <p-inputNumber [disabled]="true" styleClass="input-styling" id="totalIncome" formControlName="totalIncome" [minFractionDigits]="2" mode="currency" currency="BRL" locale="pt-BR"> </p-inputNumber>
                  <label for="totalIncome">Total Ganhos*</label>
                </p-floatLabel>
              </div>
              <app-erro-form class="erro-form-cadastro" [formulario]="formulario" errorText="Digite o total de gastos planejados" nameField="totalIncome"></app-erro-form>
            </div>
          </div>
          <div class="categorias-orcamento">
          <p-accordion [activeIndex]="0">
            {{incomeCategories.controls}}
            <p-accordionTab [header]="'Ganhos - R$'+formulario.get('totalIncome')?.value">
              <p-button icon="pi pi-plus" [style]="{'width': '100%', 'background-color':'#2196F3', 'border': '1px solid #2196F3'}" label="Adicionar" (click)="addCategory('income')"></p-button>
              <div formArrayName="incomeCategories">
                @for (item of incomeCategories.controls; track item; let index = $index) {
                  <div class="form-category" [formGroupName]="index">
                    <div class="form-input">
                      <div class="input-field d-column">
                        <div class="input-campos">
                          <p-floatLabel [style]="{'width': '100%'}">
                            <p-colorPicker formControlName="color" />
                          </p-floatLabel>
                        </div>
                      </div>
                    </div>
                    <div class="form-input">
                      <div class="input-field d-column">
                        <div class="input-campos">
                          <p-floatLabel [style]="{'width': '100%'}">
                            <input pInputText type="text" [style]="{'width': '100%'}" id="name" formControlName="name"/>
                            <label for="name">Nome categoria*</label>
                          </p-floatLabel>
                        </div>
                        <app-erro-form class="erro-form-cadastro" [formulario]="formulario" errorText="Digite um nome válido" [nameField]="index+'.name'" nameForm="incomeCategories"></app-erro-form>
                      </div>
                    </div>
                    <div class="form-input">
                      <div class="input-field d-column">
                        <div class="input-campos">
                          <p-floatLabel [style]="{'width': '100%'}">
                            <p-inputNumber styleClass="input-styling" id="amount" formControlName="amount" [minFractionDigits]="2" mode="currency" currency="BRL" locale="pt-BR" (onInput)="validateTotal('income')"></p-inputNumber>
                            <label for="amount">Total p/ categoria*</label>
                          </p-floatLabel>
                        </div>
                        <app-erro-form class="erro-form-cadastro" [formulario]="formulario" errorText="Digite o total de ganhos planejados" nameField="amount"></app-erro-form>
                      </div>
                    </div>
                    @if (item.get('default')?.getRawValue()) {
                      <p-tag value="Categoria Padrão" />
                    } @else {
                      <p-button icon="pi pi-trash" [style]="{'width': '100%', 'background-color':'#ef4444', 'border': '1px solid #ef4444'}" label="Remover" (click)="removeCategory('income', index)"></p-button>
                    }
                  </div>
                }
              </div>
            </p-accordionTab>
            <p-accordionTab [header]="'Gastos - R$'+formulario.get('totalExpense')?.value">
            {{expenseCategories.controls}}
              <p-button icon="pi pi-plus" [style]="{'width': '100%', 'background-color':'#2196F3', 'border': '1px solid #2196F3'}" label="Adicionar" (click)="addCategory('expense')"></p-button>
              <div formArrayName="expenseCategories">
              @for (item of expenseCategories.controls; track item; let index = $index) {
                  <div class="form-category" [formGroupName]="index">
                    <div class="form-input">
                      <div class="input-field d-column">
                        <div class="input-campos">
                          <p-floatLabel [style]="{'width': '100%'}">
                            <p-colorPicker formControlName="color" />
                          </p-floatLabel>
                        </div>
                      </div>
                    </div>
                    <div class="form-input">
                      <div class="input-field d-column">
                        <div class="input-campos">
                          <p-floatLabel [style]="{'width': '100%'}">
                            <input pInputText type="text" [style]="{'width': '100%'}" id="name" formControlName="name"/>
                            <label for="name">Nome categoria*</label>
                          </p-floatLabel>
                        </div>
                        <app-erro-form class="erro-form-cadastro" [formulario]="formulario" errorText="Digite um nome válido" [nameField]="index+'.name'" nameForm="expenseCategories"></app-erro-form>
                      </div>
                    </div>
                    <div class="form-input">
                      <div class="input-field d-column">
                        <div class="input-campos">
                          <p-floatLabel [style]="{'width': '100%'}">
                            <p-inputNumber styleClass="input-styling" id="amount" formControlName="amount" [minFractionDigits]="2" mode="currency" currency="BRL" locale="pt-BR" (onInput)="validateTotal('expense')"></p-inputNumber>
                            <label for="amount">Total p/ categoria*</label>
                          </p-floatLabel>
                        </div>
                        <app-erro-form class="erro-form-cadastro" [formulario]="formulario" errorText="Digite o total de ganhos planejados" nameField="amount"></app-erro-form>
                      </div>
                    </div>
                    @if (item.get('default')?.getRawValue()) {
                      <p-tag value="Categoria Padrão" />
                    } @else {
                      <p-button icon="pi pi-trash" [style]="{'width': '100%', 'background-color':'#ef4444', 'border': '1px solid #ef4444'}" label="Remover" (click)="removeCategory('expense', index)"></p-button>
                    }
                  </div>
                }
              </div>
            </p-accordionTab>
          </p-accordion>
          </div>
        </form>
        <div class="buttons-form">
          <div class="button"><p-button icon="pi pi-check" [style]="{'width': '100%', 'background-color':'#2196F3', 'border': '1px solid #2196F3'}" label="Salvar" (click)="submitForm()"></p-button></div>

          <div class="button"><p-button icon="pi pi-times" [style]="{'width': '100%', 'background-color':'#D32F2F', 'border': '1px solid #D32F2F'}" label="Cancelar" (click)="close()"></p-button></div>
        </div>
      </div>
    </div>
    <p-toast position="top-center"></p-toast>
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

    ::ng-deep span.p-calendar {
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

    .buttons-form {
      display: grid;
      grid-gap: 10px;
      grid-template-columns: 1fr 1fr;
    }

    .form-category {
      display: grid;
      grid-template-columns: 1fr 5fr 2fr 1fr;
      grid-gap: 10px;
      align-items: center;
      margin: 10px 0px;
    }

    @media (max-width: 860px) {
      .buttons-form {
        grid-template-columns: 1fr 1fr;
      }

      .form-category {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 600px) {
      .buttons-form {
        grid-template-columns: 1fr;
      }

      .form-category {
        grid-template-columns: 1fr;
      }
    }
  `
})
export class OrcamentosFormComponent implements OnInit {
  private user: UserForm = {} as UserForm;
  protected authService: any = inject(LoginService);
  protected budgetService: Orcamentos = inject(OrcamentosService);
  protected messageService: any = inject(MessageService);

  @Output() onSubmit = new EventEmitter();

  formBuilder = inject(FormBuilder);
  formulario!: FormGroup;

  ngOnInit(): void {
    this.user = this.authService.getUser();

    this.formulario = this.formBuilder.group({
      id: [null],
      totalExpense: [0, Validators.required],
      totalIncome: [0, Validators.required],
      incomeCategories: this.formBuilder.array([]),
      expenseCategories: this.formBuilder.array([]),
    });

    this.getOrcamento();
  }

  async getOrcamento() {
    this.budgetService.getBudget(this.user.id);
    const data = await lastValueFrom(this.budgetService.getBudget(this.user.id).pipe(
      catchError(error => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao recuperar orçamento: ' + error.error.message })
        return [];
      })
    ));

    this.formulario.get('id')?.setValue(data.id);
    this.formulario.get('totalExpense')?.setValue(data.totalExpense);
    this.formulario.get('totalIncome')?.setValue(data.totalIncome);
    if(data.categories?.length > 0) {
      data.categories.forEach((cat: any) => {
        const categoryForm = this.formBuilder.group({
          id: [cat.id],
          color: [cat.color],
          name: [cat.category, Validators.required],
          amount: [cat.amount, [Validators.required, Validators.min(0)]],
          type: [cat.type, [Validators.required]],
          default: [cat.default]
        });

        if(cat.type == 'expense') {
          this.expenseCategories.push(categoryForm);
        } else {
          this.incomeCategories.push(categoryForm);
        }
      })
    }
  }

  get incomeCategories() {
    return this.formulario.get('incomeCategories') as FormArray;
  }

  get expenseCategories() {
    return this.formulario.get('expenseCategories') as FormArray;
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((campo) => {
      const controle = formGroup.get(campo);
      controle?.markAsDirty();
      controle?.markAsTouched();

      if (controle instanceof FormGroup) {
        this.markFormGroupTouched(controle);
      } else if (controle instanceof FormArray) {
        controle.controls.forEach((ctrl) => {
          if (ctrl instanceof FormGroup) {
            this.markFormGroupTouched(ctrl);
          } else {
            ctrl.markAsDirty();
            ctrl.markAsTouched();
          }
        });
      }
    });
  }

  submitForm() {
    if(this.formulario.valid) {
      if(this.incomeCategories.length == 0 || this.expenseCategories.length == 0) {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao atualizar orçamento. Ganhos e gastos precisam ter pelo menos uma categoria!'});
      } else
        this.onSubmit.emit(this.formulario.value);
    } else {
      this.markFormGroupTouched(this.formulario);
    }
  }

  addCategory(type: 'income' | 'expense'): void {
    const categoryForm = this.formBuilder.group({
      id: [null],
      color: ['0000FF'],
      name: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(0)]],
      type: [type, [Validators.required]]
    });

    if (type === 'income') {
      this.incomeCategories.push(categoryForm);
    } else {
      this.expenseCategories.push(categoryForm);
    }
  }

  removeCategory(type: 'income' | 'expense', index: number): void {
    if (type === 'income') {
      this.incomeCategories.removeAt(index);
    } else {
      this.expenseCategories.removeAt(index);
    }
    this.validateTotal(type);
  }

  validateTotal(type: 'income' | 'expense'): void {
    const categories = type === 'income' ? this.incomeCategories : this.expenseCategories;
    const totalField = type === 'income' ? 'totalIncome' : 'totalExpense';

    const sum = categories.controls.reduce((acc, control) => acc + control.get('amount')?.value, 0);

    this.formulario.get(totalField)?.setValue(sum, { emitEvent: false });
  }

  clear() {
    this.incomeCategories.clear();
    this.expenseCategories.clear();
    this.validateTotal('income');
    this.validateTotal('expense');

    this.getOrcamento();
  }

  close() {
    this.clear();
  }
}
