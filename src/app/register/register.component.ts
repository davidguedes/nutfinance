import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { ErroFormComponent } from '../shared/erro-form/erro-form.component';
import { MessageService } from 'primeng/api';
import { InputNumberModule } from 'primeng/inputnumber';
import { catchError, lastValueFrom } from 'rxjs';
import { RegisterService } from './register.service';
import { Router } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    ReactiveFormsModule,
    ErroFormComponent,
    FloatLabelModule,
    PasswordModule,
    ToastModule,
    InputTextModule,
    InputNumberModule,
    ProgressSpinnerModule
  ],
  template: `
    <div class="container">
      <div class="login-form">
        <div class="logo">
          <img width="150" src="../../assets/png/logo.png" alt="Logotipo NutFinance">
        </div>
        <div *ngIf="!finishRegister">
          <form [formGroup]="formulario" (keydown.enter)="register()">
            <div class="form-input">
              <div class="input-field d-column">
                <div class="input-campos">
                  <p-floatLabel [style]="{'width': '100%'}">
                    <input autofocus pInputText type="text" [style]="{'width': '100%'}" id="name" formControlName="name"/>
                    <label for="name">Nome*</label>
                  </p-floatLabel>
                </div>
                <app-erro-form class="erro-form-login" [formulario]="formulario" errorText="Digite um nome válido" nameField="name"></app-erro-form>
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
                <app-erro-form class="erro-form-cadastro" [formulario]="formulario" errorText="Digite um dia válido" nameField="closing_date"></app-erro-form>
              </div>
            </div>
            <div class="form-input">
              <div class="input-field d-column">
                <div class="input-campos">
                  <p-floatLabel [style]="{'width': '100%'}">
                    <input autofocus pInputText type="text" [style]="{'width': '100%'}" id="email" formControlName="email"/>
                    <label for="email">Email*</label>
                  </p-floatLabel>
                </div>
                <app-erro-form class="erro-form-login" [formulario]="formulario" errorText="Digite um email válido" nameField="email"></app-erro-form>
              </div>
            </div>
            <div class="form-input">
              <div class="input-field d-column">
                <div class="input-campos">
                  <p-floatLabel [style]="{'width': '100%'}">
                    <p-password [toggleMask]="true" [feedback]="false" autofocus [style]="{'width': '100%'}" id="password" formControlName="password"/>
                    <label for="password">Senha*</label>
                  </p-floatLabel>
                </div>
                <app-erro-form class="erro-form-login" [formulario]="formulario" errorText="Digite uma senha válida" nameField="password"></app-erro-form>
              </div>
            </div>
            <div class="form-input">
              <div class="input-field d-column">
                <div class="input-campos">
                  <p-floatLabel [style]="{'width': '100%'}">
                    <p-password [toggleMask]="true" [feedback]="false" autofocus [style]="{'width': '100%'}" id="confirm_password" formControlName="confirm_password"/>
                    <label for="confirm_password">Confirmar Senha*</label>
                  </p-floatLabel>
                </div>
                <app-erro-form class="erro-form-login" [formulario]="formulario" errorText="Digite uma senha válida" nameField="confirm_password"></app-erro-form>
              </div>
            </div>
          </form>
          <div class="buttons-form">
            <div class="button"><p-button [style]="{'width': '100%', 'background-color':'#2196F3', 'border': '1px solid #2196F3'}" label="Cadastrar" (click)="register()"></p-button></div>
          </div>
        </div>
        <div *ngIf="finishRegister" class="finish-spinner">
          <p-progressSpinner ariaLabel="loading" />
        </div>
      </div>
    </div>
    <p-toast position="top-center"></p-toast>
  `,
  styles: `
    p-inputNumber {
      width: 100%!important;
    }
    p-password {
      width: 100%!important;
    }
    ::ng-deep .p-password-input  {
      width: 100%!important;
    }
    ::ng-deep span.input-styling.p-inputnumber.p-component {
      width: 100%!important;
    }
    .form-input {
      padding: 16px;
      width: 100%;
    }
    .container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }
    .logo{
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 30px;
    }
    .login-form {
      background-color: rgba(1, 97, 255, 0.15);
      border-radius: 20px;
      padding: 20px;
      width: 30%;
    }
    .buttons-form {
      margin-top: 20px
    }
    .finish-spinner {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    @media (max-width: 992px) {
      .login-form {
        width: 50%;
      }
    }
    @media (max-width: 635px) {
      .login-form {
        width: 75%;
      }
    }
  `,
  providers: [MessageService]
})
export class RegisterComponent implements OnInit {
  protected registerService: any = inject(RegisterService);
  protected messageService = inject(MessageService);
  protected router = inject(Router);
  formBuilder = inject(FormBuilder);
  formulario!: FormGroup;
  finishRegister: boolean = false;

  ngOnInit(): void {
    this.formulario = this.formBuilder.group({
      name: [null, [Validators.required]],
      closing_date: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6)]],
      confirm_password: [null, [Validators.required, Validators.minLength(6)]],
    });
  }

  async register() {
    if(this.formulario.valid) {
      if(this.formulario.get('password')?.value !== this.formulario.get('confirm_password')?.value) {
        this.formulario.get('password')?.setValue('');
        this.formulario.get('confirm_password')?.setValue('');
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'As senhas precisam ser iguais!' });
        return;
      }
      let { name, email, password, closing_date } = this.formulario.value;

      const createUser = await lastValueFrom(this.registerService.register(name, email, password, closing_date).pipe(
        catchError(error => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro! ' + error.error.message })
          return error;
        })
      ));
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Cadastro realizado com sucesso!' });

      this.finishRegister = true;
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 1000);
    } else {
      Object.keys(this.formulario.controls).forEach((campo) => {
        const controle = this.formulario.get(campo);
        controle?.markAsDirty();
        controle?.markAsTouched();
      });
    }
  }

}
