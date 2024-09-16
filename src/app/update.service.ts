import { inject, Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class UpdateService {
  protected messageService = inject(MessageService);
  private updates = inject(SwUpdate);

  constructor() {
    if (this.updates.isEnabled) {
      console.log('Entrou nesse if do constructor')
      this.updates.versionUpdates.subscribe(event => {
        console.log('[0] event.type: ', event);

        if (event.type === "VERSION_READY") {
          this.promptUser();
          window.location.reload();
        }
      });
    }
  }

  promptUser() {
    this.messageService.add({
      severity: 'info',
      summary: 'Nova versão disponível!',
      detail: 'Clique aqui para atualizar.',
      sticky: true, // Permite que a notificação não desapareça até a ação do usuário
    });
  }

  activateUpdate() {
    this.updates.activateUpdate().then(() => document.location.reload());
  }
}
