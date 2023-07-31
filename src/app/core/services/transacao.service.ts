import { Injectable } from "@angular/core";
import { TransacaoModel } from "../models";

@Injectable({
  providedIn: "root"
})
export class TransacaoService {
  private valor: number = 0;
  private transacoes: TransacaoModel[] = [
    {id: 1, valor: 5, tipo: 'S'},
    {id: 2, valor: 1000, tipo: 'S'},
    {id: 3, valor: 150, tipo: 'D'},
    {id: 4, valor: 800, tipo: 'S'},
    {id: 5, valor: 868, tipo: 'D'},
    {id: 6, valor: 58, tipo: 'D'},
  ];

  insertTransacao(transacao: TransacaoModel): void {
    this.transacoes.push(transacao);
  }

  getTransacoes(): TransacaoModel[] {
    return this.transacoes;
  }

  getTransacaoById(id: number): TransacaoModel | undefined {
    return this.transacoes.find(transacao => transacao.id === id) || undefined;
  }

  removeTransacaoById(id: number): void {
    const index = this.transacoes.findIndex(c => c.id === id);

    if(index > -1) {
      this.transacoes.splice(index, 1);
    }
  }

  fechamento(): number {
    this.transacoes.map(t => {
      if(t.tipo === 'S')
        this.valor += t.valor;
      else
        this.valor -= t.valor;
    });
    return this.valor;
  }
}
