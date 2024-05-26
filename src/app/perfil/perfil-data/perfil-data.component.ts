import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ErroFormComponent } from '../../shared/erro-form/erro-form.component';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';
import { LoginService } from '../../login/login.service';

@Component({
  selector: 'app-perfil-data',
  standalone: true,
  imports: [CommonModule, AvatarModule, ReactiveFormsModule, InputNumberModule, InputTextModule, FloatLabelModule, ErroFormComponent, ButtonModule],
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
                  <p-inputNumber styleClass="input-styling" id="closing_date" formControlName="closing_date" [minlength]="1" [maxlength]="28"> </p-inputNumber>
                  <label for="closing_date">Dia de fechamento*</label>
                </p-floatLabel>
              </div>
              <app-erro-form class="erro-form-cadastro" [formulario]="formulario" errorText="Digite um nome válido" nameField="closing_date"></app-erro-form>
            </div>
          </div>
        </form>
        @if(false) {
          <div class="buttons-form">
            <div class="button"><p-button icon="pi pi-check" [style]="{'width': '100%', 'background-color':'#2196F3', 'border': '1px solid #2196F3'}" label="Salvar" (click)="submitForm()"></p-button></div>

            <div class="button"><p-button icon="pi pi-eraser" [style]="{'width': '100%', 'background-color':'#fab710', 'border': '1px solid #fab710'}" label="Limpar" (click)="clear()"></p-button></div>
          </div>
        }
      </div>
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
      grid-template-columns: 1fr 1fr 1fr;
    }
  `
})
export class PerfilDataComponent implements OnInit{
  protected authService: any = inject(LoginService);
  formBuilder = inject(FormBuilder);
  formulario!: FormGroup;
  user: any;

  ngOnInit(): void {
    this.user = this.authService.getUser();

    this.formulario = this.formBuilder.group({
      name: [{value: this.user.name ?? null, disabled: true}, [Validators.required]],
      email: [{value: this.user.email ?? null, disabled: true}, [Validators.required]],
      closing_date: [{value: this.user.closingDate ?? null, disabled: true}, [Validators.required]],
    });
  }

  submitForm() {

  }

  clear() {

  }
}
