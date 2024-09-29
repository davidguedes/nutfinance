import { Component, EventEmitter, Input, Output, booleanAttribute, OnInit, inject } from '@angular/core';
import { SidebarModule } from 'primeng/sidebar';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { LoginService } from '../login/login.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [SidebarModule, MenuModule],
  template: `
    <p-sidebar [(visible)]="valueSidebarVisible" (onHide)="toggleVisible($event)">
      <h3>Nutfinance</h3>
      <p-menu [model]="items"></p-menu>
    </p-sidebar>
  `,
  styles: ``
})
export class SidebarComponent implements OnInit {
  @Input({ transform: booleanAttribute }) valueSidebarVisible: boolean = false;
  @Output() sidebarVisible = new EventEmitter<boolean>();
  protected router = inject(Router);
  protected loginService: any = inject(LoginService);

  items: MenuItem[] | undefined;

  toggleVisible(value: boolean): void {
    this.sidebarVisible.emit(false);
  }

  ngOnInit() {
    this.items = [
        {
          label: 'Home',
          icon: 'pi pi-fw pi-home',
          command: () => {this.router.navigate(['/']); this.toggleVisible(false)}
        },
        {
          label: 'Transações',
          icon: 'pi pi-fw pi-list',
          command: () => {this.router.navigate(['/transacoes']); this.toggleVisible(false)}
        },
        {
          label: 'Fixas',
          icon: 'pi pi-fw pi-minus',
          command: () => {this.router.navigate(['/fixas']); this.toggleVisible(false)}
        },
        /*{
          label: 'Categorias',
          icon: 'pi pi-fw pi-th-large',
          command: () => {this.router.navigate(['/categorias']); this.toggleVisible(false)}
        },*/
        {
          label: 'Orçamento',
          icon: 'pi pi-fw pi-calculator',
          command: () => {this.router.navigate(['/orcamento']); this.toggleVisible(false)}
        },
        {
          label: 'Gráficos',
          icon: 'pi pi-fw pi-chart-pie',
          command: () => {this.router.navigate(['/']); this.toggleVisible(false)},
          disabled: true
        },
        {
          label: 'Fechamentos',
          icon: 'pi pi-fw pi-clipboard',
          command: () => {this.router.navigate(['/fechamentos']); this.toggleVisible(false)}
        },
        {
          label: 'Perfil',
          icon: 'pi pi-fw pi-user',
          command: () => {this.router.navigate(['/perfil']); this.toggleVisible(false)}
        },
        {
          label: 'Sair',
          icon: 'pi pi-fw pi-sign-out',
          command: () => {this.loginService.logout(), this.router.navigate(['/login']); this.toggleVisible(false)}
        }
    ];
  }
}
