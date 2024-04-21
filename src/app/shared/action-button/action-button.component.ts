import { Component, EventEmitter, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-action-button',
  standalone: true,
  imports: [ButtonModule],
  template: `
    <p-button class="action-button" icon="pi pi-money-bill" (onClick)="functionButton.emit(true)"></p-button>
  `,
  styles: `
  .action-button {
    display: block;
    position: fixed;
    width: 3rem;
    height: 3rem;
    line-height: 3rem;
    background: var(--primary-color);
    color: var(--primary-color-text);
    text-align: center;
    top: 50%;
    right: 0;
    margin-top: -1.5rem;
    border-top-left-radius: var(--border-radius);
    border-bottom-left-radius: var(--border-radius);
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    transition: background-color var(--transition-duration);
    overflow: hidden;
    cursor: pointer;
    z-index: 999;
    box-shadow: -0.25rem 0 1rem rgba(0, 0, 0, 0.15);
  }
  .action-button:hover {
    background: var(--primary-400);
  }
  `
})
export class ActionButtonComponent {
  @Output() functionButton = new EventEmitter<boolean>();
}
