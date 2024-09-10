import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormArray, FormGroup, FormsModule } from '@angular/forms';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-erro-form',
  standalone: true,
  imports: [CommonModule, FormsModule, MessageModule],
  template: `
    <p-message severity="error" [style]="{'width':'100%', 'display': 'flex', 'justify-content':'start'}" [text]="errorText" *ngIf="verificaValidTouched(nameField, nameForm)"></p-message>
  `,
  styles: ``
})
export class ErroFormComponent {
  @Input() formulario!: FormGroup;
  @Input() nameField: string = '';
  @Input() nameForm: string | undefined = undefined;
  @Input() errorText: string = '';

  verificaValidTouched(campo: string, formArrayName?: string): boolean {
    let control;

    if (formArrayName) {
      // Se um FormArray ou FormGroup for especificado
      const formArray = this.formulario.get(formArrayName) as FormArray;
      if (!formArray) {
        console.error(`FormArray com nome ${formArrayName} não encontrado.`);
        return false;
      }

      const index = parseInt(campo.split('.')[0], 10);
      const fieldName = campo.split('.')[1];

      if (formArray.at(index)) {
        control = formArray.at(index).get(fieldName);
      }
    } else {
      // Caso contrário, assume que o campo está diretamente no FormGroup principal
      control = this.formulario.get(campo);
    }

    if (control) {
      return !control.valid && control.touched;
    }

    return false;
  }
}
