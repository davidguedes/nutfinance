import { Observable } from "rxjs";

export interface Graficos {
  getFixed(user_id: string): Observable<number>;
  getProfit(user_id: string): Observable<number>;
  getExpense(user_id: string): Observable<number>;
  getSpendingCategory(user_id: string): Observable<PieChartData>;
  getComparative(user_id: string): Observable<any>;
  getProgressOfMonth(user_id: string): Observable<any>;
}

export interface GraficosFilter {
}

export interface PieChartData {
  labels: string[];
  datasets: Dataset[];
}

export interface DoubleBarChartData {
  labels: string[];
  valuesOne: number[];
  valuesTwo: number[];
}

export interface Dataset {
  data: number[];
  backgroundColor: string[];
  hoverBackgroundColor: string[];
}
