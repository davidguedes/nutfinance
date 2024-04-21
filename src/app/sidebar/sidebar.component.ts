import { Component, EventEmitter, Input, Output, booleanAttribute, OnInit, inject } from '@angular/core';
import { SidebarModule } from 'primeng/sidebar';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [SidebarModule, MenuModule],
  template: `
    <p-sidebar [(visible)]="valueSidebarVisible" (onHide)="toggleVisible($event)">
      <h3>Sidebar</h3>
      <p-menu [model]="items"></p-menu>
    </p-sidebar>
  `,
  styles: ``
})
export class SidebarComponent implements OnInit {
  @Input({ transform: booleanAttribute }) valueSidebarVisible: boolean = false;
  @Output() sidebarVisible = new EventEmitter<boolean>();
  protected router = inject(Router);

  items: MenuItem[] | undefined;

  toggleVisible(value: boolean): void {
    this.sidebarVisible.emit(false);
  }

  ngOnInit() {
    this.items = [
        {
            label: 'Home',
            icon: 'pi pi-fw pi-home',
            command: () => this.router.navigate(['/'])
        },
        {
          label: 'Transações',
          icon: 'pi pi-fw pi-list',
          command: () => this.router.navigate(['/transacoes'])
        },
        {
            label: 'Despesas',
            icon: 'pi pi-fw pi-minus'
        },
        {
            label: 'Perfil',
            icon: 'pi pi-fw pi-user'
        }
    ];
  }
}
