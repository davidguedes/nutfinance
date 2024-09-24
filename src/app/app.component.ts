import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { Subscription } from 'rxjs/internal/Subscription';
import { ConnectionService } from './connection.service';
import { LoginService } from './login/login.service';
import { ActionButtonComponent } from './shared/action-button/action-button.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { UpdateService } from './update.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, ToolbarComponent, ActionButtonComponent, ToastModule, ButtonModule],
  template: `
    <div class="layout-wrapper">
      @if (isAuthenticated) {
        <app-toolbar [valueSidebarVisible]="sidebarVisible" (sidebarVisible)="handleSidebarVisible($event)"></app-toolbar>
        <div class="layout-sidebar">
          <app-sidebar
            (swipeleft)="handleSidebarVisible(false)"
            (sidebarVisible)="handleSidebarVisible($event)"
            [valueSidebarVisible]="sidebarVisible"
          ></app-sidebar>
        </div>

        @if(!sidebarVisible){
          <!-- Detecta swipe nas bordas para abrir a sidebar -->
          <div
            class="swipe-detect-area"
            (swiperight)="handleSidebarVisible(true)"
          ></div>
        }
      }

      <div [ngClass]="{'layout-main-container': isAuthenticated}" style="touch-action: pan-y;">
        <div class="layout-main">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
    <p-toast position="top-center" key="connectionStatus"></p-toast>
    <p-toast position="top-center" key="version">
      <ng-template let-message pTemplate="message">
        <div class="flex flex-column align-items-start" style="flex: 1">
            <div class="font-medium text-lg my-3 text-900">
              {{ message.summary }}
            </div>
            <p-button size="small" label="Atualizar" (onClick)="updateService.activateUpdate()"/>
        </div>
      </ng-template>
    </p-toast>
  `,
  styles: `
    /* Área lateral para detectar swipe */
    .swipe-detect-area {
      position: fixed;
      top: 68px;
      bottom: 0;
      left: 0;
      width: 10%; /* Limita o swipe à primeira parte da tela (10%) */
      z-index: 10;
      touch-action: none; /* Impede a rolagem nesta área */
    }

    .layout-main-container {
      display: flex;
      flex-direction: column;
      min-height: calc(100vh - 67px);
      justify-content: space-between;
      padding: 1rem;
    }

    .layout-main {
      flex: 1 1 auto;
    }
  `,
  providers: [TranslateModule, MessageService, UpdateService]
})
export class AppComponent implements OnInit, OnDestroy {
  title: string = 'nutfinance';
  sidebarVisible: boolean = false;
  private connectionService: ConnectionService = inject(ConnectionService);
  protected updateService: UpdateService = inject(UpdateService);
  protected translate: TranslateService = inject(TranslateService);
  protected primeNGConfig: PrimeNGConfig = inject(PrimeNGConfig);
  protected authService: any = inject(LoginService);
  protected messageService = inject(MessageService);
  protected router = inject(Router);

  isAuthenticated: boolean = false;
  isOnline:boolean = true;

  subscription: Subscription[] = [];

  constructor(){
    this.connectionService.getConnectionStatus().subscribe((status: boolean) => {
      this.isOnline = status;
      console.log('Status da conexão:', this.isOnline ? 'Online' : 'Offline');
      if(!this.isOnline) {
        this.messageService.add({
          key: 'connectionStatus',
          severity: 'warn',
          summary: 'Offline',
          detail: 'Sem conexão com a internet'
        });
      } else {
        this.messageService.add({
          key: 'connectionStatus',
          severity: 'success',
          summary: 'Online',
          detail: 'Conexão estabelecida'
        });
      }
    });
  }

  ngOnInit(): void {
    this.authService.accessToken.subscribe((token: any) => {
      this.isAuthenticated = !!token;

      if (!this.isAuthenticated) {
        this.router.navigate(['/login']);
      }
    });

    this.translate.setDefaultLang('pt');
    this.subscription.push(
      this.translate.stream('primeng').subscribe((data: any) => { this.primeNGConfig.setTranslation(data); })
    );
  }

  handleSidebarVisible(value: boolean) {
    console.log("e ai hein")
    this.sidebarVisible = value;
  }

  ngOnDestroy() {
    this.subscription.map((s) => {
      if(s) s.unsubscribe();
    });
  }

  onMessageClick(event: any) {
    console.log('Clicou!!!!');
    if (event.detail === 'Clique aqui para atualizar.') {
      console.log('entrou no if');
      this.updateService.activateUpdate();
    }
  }
}
