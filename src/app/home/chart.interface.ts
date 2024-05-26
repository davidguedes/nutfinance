import { Observable } from "rxjs";
import { TransactionForm } from "../model/transaction.model";

export interface Graficos {
  getFixed(user_id: string): Observable<number>;
  getProfit(user_id: string): Observable<number>;
}

export interface GraficosFilter {
}
