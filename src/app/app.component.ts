import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { ActionButtonComponent } from './shared/action-button/action-button.component';
import { Subscription } from 'rxjs/internal/Subscription';
import { LoginService } from './login/login.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, ToolbarComponent, ActionButtonComponent],
  template: `
    <div class="layout-wrapper">
      @if (logged) {
        <app-toolbar  [valueSidebarVisible]="sidebarVisible" (sidebarVisible)="handleSidebarVisible($event)"></app-toolbar>
        <div class="layout-sidebar">
          <app-sidebar [valueSidebarVisible]="sidebarVisible" (sidebarVisible)="handleSidebarVisible($event)"></app-sidebar>
        </div>
      }

      <div [ngClass]="{'layout-main-container': logged}">
        <div class="layout-main">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
  styles: `
    .layout-main-container {
      display: flex;
      flex-direction: column;
      min-height: calc(100vh - 67px);
      justify-content: space-between;
      padding: 4rem;
    }

    .layout-main {
      flex: 1 1 auto;
    }
  `,
  providers: [TranslateModule]
})
export class AppComponent implements OnInit, OnDestroy {
  title: string = 'nutfinance';
  sidebarVisible: boolean = false;
  protected translate: TranslateService = inject(TranslateService);
  protected primeNGConfig: PrimeNGConfig = inject(PrimeNGConfig);
  protected authService: any = inject(LoginService);
  logged: boolean = false;

  subscription: Subscription[] = [];

  ngOnInit(): void {
    this.subscription.push(this.authService.token$.subscribe((token: string | null) => {
      if (!token || this.authService.isTokenExpired(token))
        this.logged = false;
      else
        this.logged = true;
    }));

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
}
