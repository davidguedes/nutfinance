import { Component, EventEmitter, Input, Output, booleanAttribute, inject } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { TransacoesFormComponent } from "../transacoes-form/transacoes-form.component";
import { ToastModule } from 'primeng/toast';
import { TransacoesForm } from '../../model/transacoes.model';
import { MessageService } from 'primeng/api';
import { Transacoes } from '../transacoes.interface';
import { TransacoesService } from '../transacoes.service';

@Component({
    selector: 'app-transacos-modal',
    standalone: true,
    template: `
      <p-dialog header="Transação" [(visible)]="visible" (onHide)="toggleVisible.emit(false)" [modal]="true" [style]="{width: '50vw'}">
        <app-transacoes-form (onSubmit)="postTransacao($event)" [edit]="transactionEdit" (closeModal)="close($event)"></app-transacoes-form>
      </p-dialog>
      <p-toast></p-toast>
    `,
    styles: ``,
    imports: [DialogModule, TransacoesFormComponent, ToastModule],
    providers: [MessageService]
})
export class TransacoesModalComponent {
  @Input() transactionEdit!: TransacoesForm;
  @Input({ transform: booleanAttribute }) visible: boolean = false;
  @Output() toggleVisible = new EventEmitter();
  protected transactionService: Transacoes = inject(TransacoesService);
  protected messageService = inject(MessageService);

  postTransacao(formulario: TransacoesForm) {
    const dadosFormulario = formulario;
    this.transactionService.saveData(dadosFormulario)
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Sucesso ao incluir transação' });
    this.close(true);
    //this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Erro ao incluir transação' });
  }

  close(close: boolean) {
    console.log('Passou por aqui ', this.transactionEdit);
    this.visible = close === true ? false : true;
  }
}
