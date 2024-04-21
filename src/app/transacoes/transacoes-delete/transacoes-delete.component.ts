import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-transacoes-delete',
  standalone: true,
  imports: [ButtonModule, ToastModule, ConfirmDialogModule],
  template: `
    <p-button severity="danger" (click)="confirm()" icon="pi pi-trash"></p-button>

    <p-toast></p-toast>
    <p-confirmDialog #cd>
        <ng-template pTemplate="headless" let-message>
            <div class="flex flex-column align-items-center p-5 surface-overlay border-round">
                <div class="border-circle bg-primary inline-flex justify-content-center align-items-center h-6rem w-6rem -mt-8">
                  <i class="pi pi-question text-5xl"></i>
                </div>
                <span class="font-bold text-2xl block mb-2 mt-4">{{ message.header }}</span>
                <p class="mb-0">{{ message.message }}</p>
                <div class="flex align-items-center gap-2 mt-4">
                  <button pButton label="Salvar" (click)="cd.accept()" class="w-8rem"></button>
                  <button pButton label="Cancelar" (click)="cd.reject()" class="p-button-outlined w-8rem "></button>
                </div>
            </div>
        </ng-template>
    </p-confirmDialog>
  `,
  styles: `

  `,
  providers: [ConfirmationService, MessageService]
})
export class TransacoesDeleteComponent {
  protected confirmationService: any = inject(ConfirmationService);
  protected messageService: any = inject(MessageService);

  confirm() {
    this.confirmationService.confirm({
      header: 'Deseja realemnte excluir o registro?',
      message: 'Por favor, confirme a operação.',
      accept: () => {
        this.messageService.add({ severity: 'info', summary: 'Confirmada', detail: 'Operação confirmada', life: 3000 });
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejeitada', detail: 'Operação rejeitada', life: 3000 });
      }
    });
  }
}
