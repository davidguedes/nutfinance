import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { ErroFormComponent } from '../shared/erro-form/erro-form.component';
import { LoginService } from './login.service';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { catchError, lastValueFrom, throwError } from 'rxjs';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

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
    InputTextModule,
    ProgressSpinnerModule,
    RouterModule
  ],
  template: `
    @if(loading) {
      <div class="loading-view">
        <p-progressSpinner
        styleClass="w-4rem h-4rem"
        strokeWidth="8"
        fill="var(--surface-ground)"
        animationDuration=".5s" />
      </div>
    } @else {
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
                    <p-password [toggleMask]="true" [feedback]="false" [style]="{'width': '100%'}" id="password" formControlName="password" (keydown)="onKeyDown($event)"/>
                    <label for="password">Senha*</label>
                  </p-floatLabel>
                </div>
                <app-erro-form class="erro-form-login" [formulario]="formulario" errorText="Digite uma senha válida" nameField="password"></app-erro-form>
              </div>
            </div>
          </form>
          <div class="buttons-form">
            <div class="button"><p-button [style]="{'width': '100%', 'background-color':'#2196F3', 'border': '1px solid #2196F3'}" label="Login" (onClick)="login()"></p-button></div>
          </div>
          <div class="anchor-register">
            <a [routerLink]="['/register']" routerLinkActive="active">Cadastre-se</a>
          </div>
        </div>
      </div>
    }
    <p-toast position="top-center"></p-toast>
  `,
  styles: `
    .loading-view {
      width: 100vw;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
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
      min-height: 100vh;
      padding: 10px;
      box-sizing: border-box; /* Garante que o padding seja contabilizado corretamente */
    }
    .logo{
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 15px;
    }
    .login-form {
      background-color: rgba(1, 97, 255, 0.15);
      border-radius: 20px;
      padding: 20px;
      width: 90%;
      max-width: 400px; /* Limita a largura máxima para telas maiores */
    }
    .buttons-form {
      margin-top: 20px
    }
    .anchor-register {
      margin-top: 20px;
      text-align: center;
    }
    @media (min-width: 992px) {
      .login-form {
        width: 50%; /* Aumenta a largura em telas maiores */
      }
    }
    @media (min-width: 635px) and (max-width: 991px) {
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
  loading: boolean = false;

  ngOnInit(): void {
    this.formulario = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(4)]],
    });
  }

  login() {
    if(this.formulario.valid) {
      this.loading = true;
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
      }).finally(() => {
        this.loading = false;
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
