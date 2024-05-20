import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [PaginatorModule],
  template: `
    <div class="container-paginator">
      <p-paginator (onPageChange)="onPageChange($event)" [first]="first" [rows]="rows" [totalRecords]="total" [rowsPerPageOptions]="[10, 50, 100]"></p-paginator>
    </div>
  `,
  styles: `
    .container-paginator{
      width: 100%;
    }
  `
})
export class PaginatorComponent {
  @Output() onPageChangeEvent = new EventEmitter();

  @Input() first: number = 0;
  @Input() rows: number = 0;
  @Input() total: number = 0;

  onPageChange(event: PaginatorState){
    this.onPageChangeEvent.emit(event);
  }

}
