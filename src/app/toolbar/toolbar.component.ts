import { Component, EventEmitter, Input, Output, booleanAttribute, inject } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [MenubarModule, ButtonModule],
  template: `
  <div class="card">
      <p-menubar [model]="items">
          <ng-template pTemplate="start">
            <p-button icon="pi pi-bars" (onClick)="toggleVisible(!valueSidebarVisible)" [rounded]="true" [text]="true"></p-button>
          </ng-template>
          <ng-template pTemplate="end">
            <img width="45" src="assets/png/icon.png" alt="Logotipo NutFinance" (click)="router.navigate(['/'])">
          </ng-template>
      </p-menubar>
  </div>
  `,
  styles: ``
})
export class ToolbarComponent {
  items: MenuItem[] | undefined;
  @Input({ transform: booleanAttribute }) valueSidebarVisible: boolean = false;
  @Output() sidebarVisible = new EventEmitter<boolean>();
  protected router = inject(Router);

  toggleVisible(value: boolean): void {
    this.valueSidebarVisible = value;
    this.sidebarVisible.emit(this.valueSidebarVisible);
  }
}
