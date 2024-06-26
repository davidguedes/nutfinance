import { Component, EventEmitter, Input, OnInit, Output, booleanAttribute, inject } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { catchError, lastValueFrom } from 'rxjs';
import { FixedForm } from '../../model/fixed.model';
import { Fixas } from '../fixas.interface';
import { FixasService } from '../fixas.service';
import { FixasFormComponent } from '../fixas-form/fixas-form.component';

@Component({
  selector: 'app-fixas-modal',
  standalone: true,
  template: `
    <p-dialog header="Fixas" [(visible)]="visible" (onHide)="toggleVisible.emit({visible: false, alter: alter})" [draggable]="false" [resizable]="false" [modal]="true" [style]="{width: '50vw'}" [breakpoints]="{ '960px': '75vw', '660px': '90vw' }">
      <app-fixas-form (onSubmit)="createFixa($event)" [edit]="fixedEdit" (closeModal)="close($event)"></app-fixas-form>
    </p-dialog>
    <p-toast></p-toast>
  `,
  styles: `
  `,
  imports: [DialogModule, ToastModule, FixasFormComponent],
  providers: [MessageService]
})
export class FixasModalComponent {
  @Input() fixedEdit!: FixedForm | undefined;
  @Input({ transform: booleanAttribute }) visible: boolean = false;
  @Output() toggleVisible = new EventEmitter();
  protected fixedService: Fixas = inject(FixasService);
  protected messageService = inject(MessageService);
  alter: boolean = false;

  async createFixa(formulario: FixedForm) {
    const dadosFormulario = formulario;
    let textDetail = ``;
    //this.transactionService.saveData(dadosFormulario)
    if(dadosFormulario.id) {
      const updateFixed = await lastValueFrom(this.fixedService.updateFixed(dadosFormulario).pipe(
        catchError(error => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao atualizar cadastro ' + error.error.message })
          return error;
        })
      ));
      textDetail = "Sucesso ao atualizar fixa";
    } else {
      const createTransaction = await lastValueFrom(this.fixedService.createFixed(dadosFormulario).pipe(
        catchError(error => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao realizar cadastro ' + error.error.message })
          return error;
        })
      ));
      textDetail = "Sucesso ao incluir fixa";
    }

    this.messageService.add({ severity: 'success', summary: 'Success', detail: textDetail });
    this.alter = true;
    this.close(true);
  }

  close(close: boolean) {
    this.visible = close === true ? false : true;
  }
}
