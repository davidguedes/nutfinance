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
import { ConnectionService } from '../../connection.service';
import { OfflineService } from '../../offline-service/offline-service.service';

@Component({
    selector: 'app-transacos-modal',
    standalone: true,
    template: `
      <p-dialog header="Transação" [(visible)]="visible" (onHide)="toggleVisible.emit({visible: false, alter: alter})" [draggable]="false" [resizable]="false" [modal]="true" [style]="{width: '50vw'}" [breakpoints]="{ '960px': '75vw', '660px': '90vw' }">
        <app-transacoes-form (onSubmit)="createTransacao($event)" [categorias]="budgetCategory" [edit]="transactionEdit" (closeModal)="close($event)"></app-transacoes-form>
      </p-dialog>
      <p-toast></p-toast>
    `,
    styles: `
    `,
    imports: [DialogModule, TransacoesFormComponent, ToastModule],
    providers: [MessageService]
})
export class TransacoesModalComponent implements OnInit {
  @Input() budgetCategory: any = {
    expense: [],
    income: []
  };
  @Input() transactionEdit!: TransactionForm | undefined;
  @Input({ transform: booleanAttribute }) visible: boolean = false;
  @Output() toggleVisible = new EventEmitter();
  protected transactionService: Transacoes = inject(TransacoesService);
  protected messageService = inject(MessageService);
  protected authService: any = inject(LoginService);
  protected offlineService = inject(OfflineService); // Novo serviço
  protected connectionService = inject(ConnectionService); // Serviço de conexão

  private user: UserForm = {} as UserForm;
  alter: boolean = false;
  isOnline: boolean = true;

  ngOnInit(): void {
    this.user = this.authService.getUser();

    // Monitorando a conexão
    this.connectionService.getConnectionStatus().subscribe(status => {
      this.isOnline = status;
      if (this.isOnline) {
        this.syncOfflineTransactions(); // Sincronizar quando online
      }
    });
  }

  async createTransacao(formulario: TransactionForm) {
    const dadosFormulario = formulario;
    formulario.user_id = this.user.id;

    if (!this.isOnline) {
      // Salvar offline se estiver desconectado
      await this.offlineService.saveOfflineTransaction(dadosFormulario);
      this.messageService.add({
        severity: 'warn',
        summary: 'Offline',
        detail: 'Transação salva offline. Será sincronizada quando a conexão for restabelecida.'
      });
    } else {
      // Caso online, salvar diretamente no servidor
      try {
        await this.saveTransactionOnline(dadosFormulario);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Transação registrada com sucesso!'
        });
      } catch (error) {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao registrar transação'
        });
      }
    }

    this.alter = true;
    this.close(true);
  }

  async saveTransactionOnline(transaction: TransactionForm) {
    if (transaction.id) {
      return await lastValueFrom(this.transactionService.updateTransaction(transaction).pipe(
        catchError(error => {
          throw error;
        })
      ));
    } else {
      return await lastValueFrom(this.transactionService.createTransaction(transaction).pipe(
        catchError(error => {
          throw error;
        })
      ));
    }
  }

  async syncOfflineTransactions() {
    const offlineTransactions = await this.offlineService.getOfflineTransactions();

    for (const transacao of offlineTransactions) {
      try {
        await this.saveTransactionOnline(transacao); // Enviar ao servidor
        await this.offlineService.deleteTransaction(transacao.id_offline!); // Remover transação offline após sincronização
        this.messageService.add({
          severity: 'success',
          summary: 'Sincronizado',
          detail: `Transação "${transacao.description}" sincronizada com sucesso.`
        });
      } catch (error) {
        console.log('Erro ao sincronizar transação:', error);
      }
    }
  }

  close(close: boolean) {
    this.visible = close === true ? false : true;
  }
}
