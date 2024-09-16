import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { ActionButtonComponent } from './shared/action-button/action-button.component';
import { Subscription } from 'rxjs/internal/Subscription';
import { LoginService } from './login/login.service';
import { ConnectionService } from './connection.service';
import { ToastModule } from 'primeng/toast';
import { UpdateService } from './update.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, ToolbarComponent, ActionButtonComponent, ToastModule],
  template: `
    <div class="layout-wrapper">
      @if (isAuthenticated) {
        <app-toolbar  [valueSidebarVisible]="sidebarVisible" (sidebarVisible)="handleSidebarVisible($event)"></app-toolbar>
        <div class="layout-sidebar">
          <app-sidebar [valueSidebarVisible]="sidebarVisible" (sidebarVisible)="handleSidebarVisible($event)"></app-sidebar>
        </div>
      }

      <div [ngClass]="{'layout-main-container': isAuthenticated}">
        <div class="layout-main">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
    <p-toast position="top-center" (onClick)="onMessageClick($event)"></p-toast>
  `,
  styles: `
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
  private updateService: UpdateService = inject(UpdateService);
  protected translate: TranslateService = inject(TranslateService);
  protected primeNGConfig: PrimeNGConfig = inject(PrimeNGConfig);
  protected authService: any = inject(LoginService);
  protected messageService = inject(MessageService);
  protected router = inject(Router);

  isAuthenticated: boolean = false;
  isOnline:boolean = true;

  subscription: Subscription[] = [];

  constructor(){
    this.connectionService.getConnectionStatus().subscribe(status => {
      this.isOnline = status;
      console.log('Status da conexão:', this.isOnline ? 'Online' : 'Offline');
      if(!this.isOnline) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Offline',
          detail: 'Sem conexão com a internet'
        });
      } else {
        this.messageService.add({
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
      this.updateService.activateUpdate();
    }
  }
}
