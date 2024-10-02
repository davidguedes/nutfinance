import { Component, EventEmitter, Input, OnInit, Output, booleanAttribute, inject } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { catchError, lastValueFrom } from 'rxjs';
import { FixedForm } from '../../model/fixed.model';
import { Fixas } from '../fixas.interface';
import { FixasService } from '../fixas.service';
import { FixasFormComponent } from '../fixas-form/fixas-form.component';
import { LoginService } from '../../login/login.service';
import { UserForm } from '../../model/user.model';

@Component({
  selector: 'app-fixas-modal',
  standalone: true,
  template: `
    <p-dialog header="Fixas" [(visible)]="visible" (onHide)="toggleVisible.emit({visible: false, alter: alter})" [draggable]="false" [resizable]="false" [modal]="true" [style]="{width: '50vw'}" [breakpoints]="{ '960px': '75vw', '660px': '90vw', '460px': '100vw' }">
      <app-fixas-form [categorias]="budgetCategory" (onSubmit)="createFixa($event)" [edit]="fixedEdit" (closeModal)="close($event)"></app-fixas-form>
    </p-dialog>
    <p-toast position="top-center"></p-toast>
  `,
  styles: `
  `,
  imports: [DialogModule, ToastModule, FixasFormComponent],
  providers: [MessageService]
})
export class FixasModalComponent implements OnInit {
  @Input() budgetCategory: any = {
    expense: [],
    income: []
  };
  @Input() fixedEdit!: FixedForm | undefined;
  @Input({ transform: booleanAttribute }) visible: boolean = false;
  @Output() toggleVisible = new EventEmitter();
  protected fixedService: Fixas = inject(FixasService);
  protected messageService = inject(MessageService);
  protected authService: any = inject(LoginService);
  private user: UserForm = {} as UserForm;
  alter: boolean = false;

  ngOnInit(): void {
    this.user = this.authService.getUser();
  }

  async createFixa(formulario: FixedForm) {
    const dadosFormulario = formulario;
    formulario.user_id = this.user.id;

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
