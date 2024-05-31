import { Component, EventEmitter, Input, OnInit, Output, booleanAttribute, inject } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { TransacoesFormComponent } from "../transacoes-form/transacoes-form.component";
import { ToastModule } from 'primeng/toast';
import { TransactionForm } from '../../model/transaction.model';
import { MessageService } from 'primeng/api';
import { Transacoes } from '../transacoes.interface';
import { TransacoesService } from '../transacoes.service';
import { catchError, lastValueFrom } from 'rxjs';
import { LoginService } from '../../login/login.service';
import { UserForm } from '../../model/user.model';

@Component({
    selector: 'app-transacos-modal',
    standalone: true,
    template: `
      <p-dialog header="Transação" [(visible)]="visible" (onHide)="toggleVisible.emit({visible: false, alter: alter})" [draggable]="false" [resizable]="false" [modal]="true" [style]="{width: '50vw'}" [breakpoints]="{ '960px': '75vw', '660px': '90vw' }">
        <app-transacoes-form (onSubmit)="createTransacao($event)" [edit]="transactionEdit" (closeModal)="close($event)"></app-transacoes-form>
      </p-dialog>
      <p-toast></p-toast>
    `,
    styles: `
    `,
    imports: [DialogModule, TransacoesFormComponent, ToastModule],
    providers: [MessageService]
})
export class TransacoesModalComponent implements OnInit {
  @Input() transactionEdit!: TransactionForm | undefined;
  @Input({ transform: booleanAttribute }) visible: boolean = false;
  @Output() toggleVisible = new EventEmitter();
  protected transactionService: Transacoes = inject(TransacoesService);
  protected messageService = inject(MessageService);
  protected authService: any = inject(LoginService);
  private user: UserForm = {} as UserForm;
  alter: boolean = false;

  ngOnInit(): void {
    this.user = this.authService.getUser();
  }

  async createTransacao(formulario: TransactionForm) {
    const dadosFormulario = formulario;
    formulario.user_id = this.user.id;

    let textDetail = ``;
    //this.transactionService.saveData(dadosFormulario)
    if(dadosFormulario.id) {
      const updateTransaction = await lastValueFrom(this.transactionService.updateTransaction(dadosFormulario).pipe(
        catchError(error => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao atualizar cadastro ' + error.error.message })
          return error;
        })
      ));
      textDetail = "Sucesso ao atualizar transação";
    } else {
      const createTransaction = await lastValueFrom(this.transactionService.createTransaction(dadosFormulario).pipe(
        catchError(error => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao realizar cadastro ' + error.error.message })
          return error;
        })
      ));
      textDetail = "Sucesso ao incluir transação";
    }

    this.messageService.add({ severity: 'success', summary: 'Success', detail: textDetail });
    this.alter = true;
    this.close(true);
  }

  close(close: boolean) {
    this.visible = close === true ? false : true;
  }
}
