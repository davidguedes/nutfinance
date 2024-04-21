import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { PrimeNGConfig } from 'primeng/api';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { ActionButtonComponent } from './shared/action-button/action-button.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, ToolbarComponent, ActionButtonComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [TranslateModule]
})
export class AppComponent implements OnInit, OnDestroy {
  title: string = 'nutfinance';
  sidebarVisible: boolean = false;
  protected translate: TranslateService = inject(TranslateService);
  protected primeNGConfig: PrimeNGConfig = inject(PrimeNGConfig);
  subscription: Subscription[] = [];

  ngOnInit(): void {
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
