import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { ErroFormComponent } from '../shared/erro-form/erro-form.component';
import { LoginService } from './login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    ReactiveFormsModule,
    ErroFormComponent,
    FloatLabelModule,
    PasswordModule
  ],
  template: `
    <div class="container">
      <div class="login-form">
        <div class="logo">
          <img width="50" src="../../assets/svg/logo.svg" alt="Logotipo NutFinance">
        </div>
        <form [formGroup]="formulario">
          <div class="form-input">
            <div class="input-field d-column">
              <div class="input-campos">
                <p-floatLabel [style]="{'width': '100%'}">
                  <p-password [toggleMask]="true" [feedback]="false" autofocus [style]="{'width': '100%'}" id="password" formControlName="password" (keydown)="onKeyDown($event)"/>
                  <label for="password">Solta o verbo*</label>
                </p-floatLabel>
              </div>
              <app-erro-form class="erro-form-login" [formulario]="formulario" errorText="Digite uma senha válida" nameField="password"></app-erro-form>
            </div>
          </div>
        </form>
        <div class="buttons-form">
          <div class="button"><p-button [style]="{'width': '100%', 'background-color':'#2196F3', 'border': '1px solid #2196F3'}" label="Tenta aí" (click)="login()"></p-button></div>
        </div>
      </div>
    </div>
  `,
  styles: `
    p-password {
      width: 100%!important;
    }
    ::ng-deep .p-password-input  {
      width: 100%!important;
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
  `
})
export class LoginComponent implements OnInit {
  protected loginService: any = inject(LoginService);
  protected router = inject(Router);

  formBuilder = inject(FormBuilder);
  formulario!: FormGroup;

  ngOnInit(): void {
    this.formulario = this.formBuilder.group({
      password: [null, [Validators.required]],
    });
  }

  login(): void {
    if(this.formulario.valid) {
      if (this.loginService.login(this.formulario.get('password')?.value)) {
        this.router.navigate(['/']);
      } else {
        // Tratamento de erro de login inválido
        alert('Login inválido! Por favor, tente novamente.');
        this.formulario.reset();
      }
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.login(); // Chame a função que deseja executar ao pressionar Enter
    }
  }
}
