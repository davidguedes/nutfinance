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
        console.log('[1] event.type: ', event);

        if (event.type === "VERSION_READY") {
          console.log('Nova versão disponível!');
          this.promptUser();
        }
      });
    }
  }

  promptUser() {
    this.messageService.add({
      key: 'version',
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
