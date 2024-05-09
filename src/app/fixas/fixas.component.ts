import { Component } from '@angular/core';
import { FixasListComponent } from './fixas-list/fixas-list.component';

@Component({
  selector: 'app-fixas',
  standalone: true,
  imports: [FixasListComponent],
  template: `
    <app-fixas-list/>
  `,
  styles: ``
})
export class FixasComponent {

}
