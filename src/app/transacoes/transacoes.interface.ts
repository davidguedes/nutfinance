import { Observable } from "rxjs";
import { TransactionForm } from "../model/transaction.model";

export interface Transacoes {
  getTransactions(filters: any): Observable<TransactionForm[]>;
  saveData(data: TransactionForm): void;
  createTransaction(data: TransactionForm): Observable<any>;
  updateTransaction(data: TransactionForm): Observable<any>;
  deleteTransaction(id: string): Observable<any>;
  getDataLocally(): TransactionForm[];
  mergeData(existingData: TransactionForm[], newData: TransactionForm[]): TransactionForm[];
  saveLocally(data: TransactionForm[]): void;
}

export interface TransacoesFilter {
  initial_date_transaction: Date,
  final_date_transaction: Date,
  tags: string[],
  type: string,
  sort: boolean,
  offset: number,
}
