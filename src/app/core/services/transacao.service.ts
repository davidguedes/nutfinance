import { Injectable } from "@angular/core";

import { TransacaoModel } from "../models";

import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: "root"
})
export class TransacaoService {
  saldoBS: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  transacoesBs: BehaviorSubject<TransacaoModel[]> = new BehaviorSubject<TransacaoModel[]>([]);
  tokenBS: BehaviorSubject<string> = new BehaviorSubject<string>('');

  /*private transacoes: TransacaoModel[] = [
    {id: 1, valor: 5, tipo: 'S'},
    {id: 2, valor: 1000, tipo: 'S'},
    {id: 3, valor: 150, tipo: 'D'},
    {id: 4, valor: 800, tipo: 'S'},
    {id: 5, valor: 868, tipo: 'D'},
    {id: 6, valor: 58, tipo: 'D'},
  ];*/

  /*insertTransacao(transacao: TransacaoModel): void {
    this.transacoes.push(transacao);
  }*/

  /*getTransacoes(): TransacaoModel[] {
    return this.transacoes;
  }*/

  /*getTransacaoById(id: number): TransacaoModel | undefined {
    return this.transacoes.find(transacao => transacao.id === id) || undefined;
  }*/

  /*removeTransacaoById(id: number): void {
    const index = this.transacoes.findIndex(c => c.id === id);

    if(index > -1) {
      this.transacoes.splice(index, 1);
    }

    this.fechamento();
  }*/

  fechamento(): void {
    let valorTransacoes: number = 0;
    this.transacoesBs.value.forEach(v => {
      if(v.tipo === 'S')
        valorTransacoes = Number(valorTransacoes) + Number(v.valor);
      else
        valorTransacoes = Number(valorTransacoes) - Number(v.valor);
    });

    //alert(`${valorTransacoes}, ${JSON.stringify(this.transacoes)}`);
    this.setSaldo(valorTransacoes);
  }

  setSaldo(valor: number): void {
    this.saldoBS.next(valor);
  }

  getSaldo(): Observable<number> {
    return this.saldoBS.asObservable();
  }

  setTransacoes(transacoes: TransacaoModel[]): void {
    this.transacoesBs.next(transacoes);
  }

  novaTransacao(transacao: TransacaoModel): void {
    let transacoes = this.transacoesBs.value;
    console.log('antes: ', JSON.stringify(transacoes));
    transacoes.unshift(transacao);
    console.log('depois: ', JSON.stringify(transacoes));

    this.transacoesBs.next(transacoes);
  }

  removeTransacaoById(id: number): void {
    const index: number = this.transacoesBs.value.findIndex(c => c.id === id);
    let transacoes: TransacaoModel[] = this.transacoesBs.value;

    console.log('O index: ' + index);
    console.log('As transacoes: ' +  JSON.stringify(transacoes));

    if(index > -1) {
      transacoes.splice(index, 1);
    }

    this.setTransacoes(transacoes);
    this.fechamento();
  }

  getTransacoes(): Observable<TransacaoModel[]> {
    return this.transacoesBs.asObservable();
  }

  setToken(token: string): void {
    this.tokenBS.next(token);
  }

  getToken(): Observable<string> {
    return this.tokenBS.asObservable();
  }
}
