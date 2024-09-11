import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { TransactionForm } from '../model/transaction.model';

@Injectable({
  providedIn: 'root',
})
export class OfflineService extends Dexie {
  transacoes: Dexie.Table<TransactionForm, number>;

  constructor() {
    super('TransactionsDatabase');

    // Definindo o schema do banco de dados
    this.version(1).stores({
      transacoes: '++id_offline, description, amount, user_id, date', // Campos que deseja indexar
    });

    this.transacoes = this.table('transacoes');
  }

  // Adiciona uma transação offline
  async saveOfflineTransaction(transaction: TransactionForm) {
    await this.transacoes.add(transaction);
    console.log('Transação salva offline:', transaction);
  }

  // Recupera todas as transações offline
  async getOfflineTransactions() {
    return await this.transacoes.toArray();
  }

  // Remove transação após sincronização
  async deleteTransaction(id: number) {
    await this.transacoes.delete(id);
  }

  // Limpa todas as transações offline
  async clearOfflineTransactions() {
    await this.transacoes.clear();
  }
}
