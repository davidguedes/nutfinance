import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-offline-page',
  standalone: true,
  imports: [ButtonModule],
  template: `
    <div class="offline-container">
      <h1>Sem Conexão</h1>
      <p>Você está offline. Verifique sua conexão e tente novamente.</p>
      <div>
        <img width="200" src="../assets/png/offline-page.png" alt="Esquilo dentro de uma nóz quebrada">
      </div>
      <p-button class="action-button" label="Tentar Novamente" (onClick)="tryAgain()"></p-button>
    </div>
  `,
  styles: [`
    .offline-container {
      text-align: center;
      padding: 20px;
    }
    button {
      margin-top: 20px;
      padding: 10px 20px;
    }
  `]
})
export class OfflinePageComponent {
  private location = inject(Location);

  tryAgain() {
    this.location.back(); // Volta para a página anterior
  }
}
