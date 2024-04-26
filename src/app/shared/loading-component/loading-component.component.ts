import { Component } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-loading-component',
  standalone: true,
  imports: [ProgressSpinnerModule],
  template: `
    <div class="spinner">
      <p-progressSpinner styleClass="w-4rem h-4rem" strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s"></p-progressSpinner>
    </div>
  `,
  styles: `
    .spinner {
      margin: 50px;
    }
  `
})
export class LoadingComponentComponent {

}
