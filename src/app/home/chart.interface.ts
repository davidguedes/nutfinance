import { Observable } from "rxjs";
import { TransactionForm } from "../model/transaction.model";

export interface Graficos {
  getFixed(): Observable<number>;
  getProfit(): Observable<number>;
}

export interface GraficosFilter {
}
