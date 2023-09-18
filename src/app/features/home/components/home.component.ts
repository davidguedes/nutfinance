import { Component, ViewContainerRef } from '@angular/core';
import { ModalDialogOptions, ModalDialogService } from '@nativescript/angular';

import { TransacaoModel } from '../../../core/models/transacao.model';
import { ModalDialogComponent } from '../../shared/modal-dialog/components';
import { setStatusBarColor } from '../../../utils';
import { TransacaoService } from '~/app/core';
import { Subscription } from 'rxjs';

@Component({
  moduleId: module.id,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  protected title: string = 'Home';
  protected valor: number = 0;
  protected token: string = '';
  private subs: Subscription[] = [];

  constructor(
    private transacaoService: TransacaoService,
    private modal: ModalDialogService,
    private vcRef: ViewContainerRef
  ) {
      console.log('testeeeeee')
  }

  ngOnInit(): void {
    setStatusBarColor('dark', '#97d9e9');
    this.realizarFechamento();

    this.subs.push(
      this.transacaoService.saldoBS.subscribe(saldo => this.valor = saldo),
      this.transacaoService.tokenBS.subscribe(resp => this.token = resp)
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  /*
  getIconSource(details: string): string {
    console.log('Valor de details: ', details);
    return '';
  }

  onSelectedIndexchanged(event) {
    console.log('Valor do event: ', event);
  }*/

  addTransacao(fullscreen: boolean, animated: boolean, stretched: boolean): void {
    const options: ModalDialogOptions = {
      viewContainerRef: this.vcRef,
      fullscreen,
      animated,
      stretched
    };

    this.modal.showModal(ModalDialogComponent, options);

    /*const options = {
      context: {},
      fullscreen: true,
      viewContainerRef: this.vcRef
    };

    this.modal.showModal(ModalDialogComponent, options).then(response => {
      console.log(response);
    })*/

    /*const options: ModalDialogOptions = {
      viewContainerRef: this._vcRef,
      context: {},
      fullscreen: true
    };

    this._modalService.showModal(AppComponent, options)
    .then((result: string) => {
        console.log(result);
    });*/
  }

  realizarFechamento() {
    this.transacaoService.fechamento();
  }
}
