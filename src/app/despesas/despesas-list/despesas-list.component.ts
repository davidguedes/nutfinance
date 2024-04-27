import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ScrollerModule } from 'primeng/scroller';

interface LazyEvent {
  first: number;
  last: number;
}

@Component({
  selector: 'app-despesas-list',
  standalone: true,
  imports: [CommonModule, ScrollerModule],
  template: `
    <div class="card flex justify-content-center">
      <p-scroller [items]="items" [itemSize]="50" [showLoader]="true" [delay]="250" [loading]="lazyLoading" [lazy]="true" (onLazyLoad)="onLazyLoad($event)" styleClass="border-1 surface-border" [style]="{'width': '200px', 'height': '200px'}">
        <ng-template pTemplate="item" let-item let-options="options">
            <div class="flex align-items-center p-2" [ngClass]="{ 'surface-ground': options.odd }" style="height: 50px;">{{ item }}</div>
        </ng-template>
      </p-scroller>
    </div>
  `,
  styles: ``
})
export class DespesasListComponent {
  items!: string[];

    lazyLoading: boolean = true;

    loadLazyTimeout: any;

    ngOnInit() {
        this.items = Array.from({ length: 1000 });
    }

    onLazyLoad(event: LazyEvent) {
      console.log("Chamada do lazy: valores ", event);
        this.lazyLoading = true;

        if (this.loadLazyTimeout) {
            clearTimeout(this.loadLazyTimeout);
        }

        //imitate delay of a backend call
        this.loadLazyTimeout = setTimeout(() => {
            const { first, last } = event;
            const lazyItems = [...this.items];

            for (let i = first; i < last; i++) {
                lazyItems[i] = `Item #${i}`;
            }

            this.items = lazyItems;
            this.lazyLoading = false;
        }, Math.random() * 1000 + 250);
    }
}
