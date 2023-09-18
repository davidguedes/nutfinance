import { Component } from '@angular/core';

import { setStatusBarColor } from '../../../utils';
import { TransacaoModel } from '../../../core/models/transacao.model';
import { Dialogs } from '@nativescript/core';
import { TransacaoService } from "~/app/core";
import { Subscription } from 'rxjs';

@Component({
  moduleId: module.id,
  selector: 'app-transacoes',
  templateUrl: './transacoes.component.html',
  styleUrls: ['./transacoes.component.scss'],
})
export class TransacoesComponent {
  protected title: string = 'Transações';
  protected transacoes: TransacaoModel[] = [];
  private subs: Subscription[] = [];

  constructor(
    private transacaoService: TransacaoService
  ) {}

  ngOnInit() {
    setStatusBarColor('dark', '#97d9e9');
    //this.getTransacoes();
    this.subs.push(
      this.transacaoService.transacoesBs.subscribe(resp => {
        console.log('O resp: ', resp);
        this.transacoes = resp
      })
    );
  }

  removerTransacao(id: number): void {
    this.transacaoService.removeTransacaoById(id);

    Dialogs.alert(`Transação ${id} removida.`)
    .then(() => {
      console.log('Dialog closed!');
    });
  }

  /*removerTransacao(id: number): void {
    this.transacaoService.removeTransacaoById(id);

    Dialogs.alert(`Transação ${id} removida.`)
    .then(() => {
      console.log('Dialog closed!');
    });

    this.getTransacoes();
  }

  getTransacoes(): void {
    this.transacoes = this.transacaoService.getTransacoes();
    console.log('Valor de transacoes: ', this.transacoes);
  }*/
}
