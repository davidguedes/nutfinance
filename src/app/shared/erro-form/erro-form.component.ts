import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-erro-form',
  standalone: true,
  imports: [CommonModule, FormsModule, MessageModule],
  template: `
    <p-message severity="error" [style]="{'width':'100%', 'display': 'flex', 'justify-content':'start'}" [text]="errorText" *ngIf="verificaValidTouched(nameField)"></p-message>
  `,
  styles: ``
})
export class ErroFormComponent {
  @Input() formulario!: FormGroup;
  @Input() nameField: string = '';
  @Input() errorText: string = '';

  verificaValidTouched(campo: string) {
    if(this.formulario.value[campo]?.length === 0) return true;

    return !this.formulario.get(campo)?.valid && this.formulario.get(campo)?.touched;
  }
}
