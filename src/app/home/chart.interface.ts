import { Observable } from "rxjs";

export interface Graficos {
  getFixed(user_id: string): Observable<number>;
  getProfit(user_id: string): Observable<number>;
  getSpendingCategory(user_id: string): Observable<PieChartData>;
}

export interface GraficosFilter {
}

export interface PieChartData {
  labels: string[];
  datasets: Dataset[];
}

export interface Dataset {
  data: number[];
  backgroundColor: string[];
  hoverBackgroundColor: string[];
}
