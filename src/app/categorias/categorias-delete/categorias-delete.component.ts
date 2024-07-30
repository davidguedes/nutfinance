import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Categorias } from '../categorias.interface';
import { CategoriasService } from '../categorias.service';
import { catchError, lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-categorias-delete',
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
  providers: [ConfirmationService, MessageService]
})
export class CategoriasDeleteComponent {
  protected confirmationService: any = inject(ConfirmationService);
  protected messageService: any = inject(MessageService);
  protected cartegoryService: Categorias = inject(CategoriasService);

  @Output() deleteButton = new EventEmitter<boolean>();
  @Input() idCategory!: string;

  confirm() {
    this.confirmationService.confirm({
      header: 'Deseja realmente excluir o registro?',
      message: 'Por favor, confirme a operação.',
      accept: () => {
        this.deleteCategory(this.idCategory);
      },
      reject: () => {}
    });
  }

  async deleteCategory(id: string) {
    const deleteCategory = await lastValueFrom(this.cartegoryService.deleteCategory(id).pipe(
      catchError(error => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao excluir categoria ' + error.error.message })
        return error;
      })
    ));

    this.deleteButton.emit(true);
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Sucesso ao excluir categoria' });
  }
}
