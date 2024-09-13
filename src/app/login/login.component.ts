import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { ErroFormComponent } from '../shared/erro-form/erro-form.component';
import { LoginService } from './login.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { catchError, lastValueFrom, throwError } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    ReactiveFormsModule,
    ErroFormComponent,
    FloatLabelModule,
    PasswordModule,
    ToastModule,
    InputTextModule
  ],
  template: `
    <div class="container">
      <div class="login-form">
        <div class="logo">
          <img width="150" src="../../assets/png/logo.png" alt="Logotipo NutFinance">
        </div>
        <form [formGroup]="formulario" (keydown.enter)="login()">
          <div class="form-input">
            <div class="input-field d-column">
              <div class="input-campos">
                <p-floatLabel [style]="{'width': '100%'}">
                  <input autofocus pInputText type="text" [style]="{'width': '100%'}" id="email" formControlName="email" #emailInput/>
                  <label for="email">Login*</label>
                </p-floatLabel>
              </div>
              <app-erro-form class="erro-form-login" [formulario]="formulario" errorText="Digite um email válido" nameField="email"></app-erro-form>
            </div>
          </div>
          <div class="form-input">
            <div class="input-field d-column">
              <div class="input-campos">
                <p-floatLabel [style]="{'width': '100%'}">
                  <p-password [toggleMask]="true" [feedback]="false" autofocus [style]="{'width': '100%'}" id="password" formControlName="password" (keydown)="onKeyDown($event)"/>
                  <label for="password">Senha*</label>
                </p-floatLabel>
              </div>
              <app-erro-form class="erro-form-login" [formulario]="formulario" errorText="Digite uma senha válida" nameField="password"></app-erro-form>
            </div>
          </div>
        </form>
        <div class="buttons-form">
          <div class="button"><p-button [style]="{'width': '100%', 'background-color':'#2196F3', 'border': '1px solid #2196F3'}" label="Login" (click)="login()"></p-button></div>
        </div>
        <div class="anchor-register">
          <a [href]="'/register'">Cadastre-se</a>
        </div>
      </div>
    </div>
    <p-toast position="top-center"></p-toast>
  `,
  styles: `
    p-password {
      width: 100%!important;
    }
    ::ng-deep .p-password-input  {
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
    .anchor-register {
      margin-top: 20px;
      text-align: center;
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
export class LoginComponent implements OnInit {
  protected loginService: any = inject(LoginService);
  protected messageService: any = inject(MessageService);
  protected router = inject(Router);
  @ViewChild('emailInput') emailInput!: ElementRef;

  formBuilder = inject(FormBuilder);
  formulario!: FormGroup;

  ngOnInit(): void {
    this.formulario = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(4)]],
    });
  }

  login() {
    if(this.formulario.valid) {
      let { email, password } = this.formulario.value;

      lastValueFrom(this.loginService.login(email, password).pipe(
        catchError(error => {
          return throwError(() => new Error(error.message));;
        })
      )).then(() => {
        this.router.navigate(['/']);
      }).catch((error) => {
        console.log('Error: ', error);
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: `Login inválido! Por favor, tente novamente. ${error.message}` })
        this.formulario.reset();
        this.emailInput.nativeElement.focus();
      });
    } else {
      Object.keys(this.formulario.controls).forEach((campo) => {
        const controle = this.formulario.get(campo);
        controle?.markAsDirty();
        controle?.markAsTouched();
      })
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.login(); // Chame a função que deseja executar ao pressionar Enter
    }
  }
}
