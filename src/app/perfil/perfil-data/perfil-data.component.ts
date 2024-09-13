import { CommonModule, registerLocaleData } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ErroFormComponent } from '../../shared/erro-form/erro-form.component';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';
import { LoginService } from '../../login/login.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UserForm } from '../../model/user.model';
import { catchError, lastValueFrom } from 'rxjs';
import { PerfilService } from '../perfil.service';
import { Perfil } from '../perfil.interface';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-perfil-data',
  standalone: true,
  imports: [CommonModule, AvatarModule, ReactiveFormsModule, InputNumberModule, InputTextModule, FloatLabelModule, ErroFormComponent, ButtonModule, ToastModule, ConfirmDialogModule],
  template: `
    <div class="formulario">
        <div class="form-avatar"><p-avatar
          icon="pi pi-user"
          styleClass="mr-2" size="xlarge"
        /></div>
        <form [formGroup]="formulario">
          <div class="form-input">
            <div class="input-field d-column">
              <div class="input-campos">
                <p-floatLabel [style]="{'width': '100%'}">
                  <input pInputText type="text" [style]="{'width': '100%'}" id="name" formControlName="name"/>
                  <label for="name">Nome*</label>
                </p-floatLabel>
              </div>
              <app-erro-form class="erro-form-cadastro" [formulario]="formulario" errorText="Digite um nome válido" nameField="name"></app-erro-form>
            </div>
          </div>

          <div class="form-input">
            <div class="input-field d-column">
              <div class="input-campos">
                <p-floatLabel [style]="{'width': '100%'}">
                  <input pInputText type="text" [style]="{'width': '100%'}" id="email" formControlName="email"/>
                  <label for="email">Email*</label>
                </p-floatLabel>
              </div>
              <app-erro-form class="erro-form-cadastro" [formulario]="formulario" errorText="Digite um nome válido" nameField="email"></app-erro-form>
            </div>
          </div>

          <div class="form-input">
            <div class="input-field d-column">
              <div class="input-campos">
                <p-floatLabel [style]="{'width': '100%'}">
                  <p-inputNumber styleClass="input-styling" id="closing_date" formControlName="closing_date" [min]="1" [max]="28"> </p-inputNumber>
                  <label for="closing_date">Dia de fechamento*</label>
                </p-floatLabel>
              </div>
              <app-erro-form class="erro-form-cadastro" [formulario]="formulario" errorText="Digite um nome válido" nameField="closing_date"></app-erro-form>
            </div>
          </div>
        </form>
        <div class="buttons-form">
          <div class="button"><p-button icon="pi pi-replay" [style]="{'width': '100%', 'background-color':'#fab710', 'border': '1px solid #fab710'}" label="Resetar Conta" (click)="confirm()"></p-button></div>
          <div class="button"><p-button icon="pi pi-save" [style]="{'width': '100%', 'background-color':'#2196F3', 'border': '1px solid #2196F3'}" label="Salvar" (click)="submitForm()"></p-button></div>
          </div>
        @if(false) {
          <div class="buttons-form">

            <div class="button"><p-button icon="pi pi-eraser" [style]="{'width': '100%', 'background-color':'#fab710', 'border': '1px solid #fab710'}" label="Limpar" (click)="clear()"></p-button></div>
          </div>
        }
    </div>
    <p-toast position="top-center"></p-toast>
    <p-confirmDialog #cd>
        <ng-template pTemplate="headless" let-message>
            <div class="flex flex-column align-items-center p-5 surface-overlay border-round">
                <div class="border-circle bg-primary inline-flex justify-content-center align-items-center h-6rem w-6rem -mt-8">
                  <i class="pi pi-question text-5xl"></i>
                </div>
                <span class="font-bold text-2xl block mb-2 mt-4">{{ message.header }}</span>
                <p class="mb-0">{{ message.message }}</p>
                <div class="flex align-items-center gap-2 mt-4">
                  <button pButton label="Salvar" (click)="cd.accept()" class="w-8rem"></button>
                  <button pButton label="Cancelar" (click)="cd.reject()" class="p-button-outlined w-8rem "></button>
                </div>
            </div>
        </ng-template>
    </p-confirmDialog>
  `,
  styles: `
    p-inputNumber {
      width: 100%!important;
    }

    ::ng-deep span.input-styling.p-inputnumber.p-component {
      width: 100%!important;
    }

    .form-avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 10px;
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
  `,
  providers: [ConfirmationService, MessageService]
})
export class PerfilDataComponent implements OnInit{
  protected confirmationService: any = inject(ConfirmationService);
  protected messageService: any = inject(MessageService);
  protected perfilService: Perfil = inject(PerfilService);
  protected authService: any = inject(LoginService);
  formBuilder = inject(FormBuilder);
  formulario!: FormGroup;
  private user: UserForm = {} as UserForm;
  resetAccount: boolean = false;

  ngOnInit(): void {
    this.user = this.authService.getUser();

    this.formulario = this.formBuilder.group({
      name: [{value: this.user.name ?? null, disabled: false}, [Validators.required]],
      email: [{value: this.user.email ?? null, disabled: true}, [Validators.required]],
      closing_date: [{value: this.user.closingDate ?? null, disabled: true}, [Validators.required]],
    });
  }

  confirm() {
    this.confirmationService.confirm({
      header: 'Deseja realmente resetar todos os seus dados? Esse processo não poderá ser revertido.',
      message: 'Por favor, confirme a operação.',
      accept: () => {
        this.reset(this.user.id);
      },
      reject: () => {}
    });
  }

  clear() {

  }

  async submitForm() {
    const dadosFormulario = this.formulario.value;
    dadosFormulario.user_id = this.user.id;

    const dataUser = await lastValueFrom(this.perfilService.update(dadosFormulario).pipe(
      catchError(error => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao salvar os dados ' + error.error.message })
        return error;
      })
    ));

    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Sucesso ao salvar os dados' });
  }

  async reset(user_id: string) {
    const resetData = await lastValueFrom(this.perfilService.reset(user_id).pipe(
      catchError(error => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao resetar dados ' + error.error.message })
        return error;
      })
    ));

    this.formulario.controls['closing_date'].enable();
    this.resetAccount = true;
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Sucesso ao resetar dados' });
  }
}
