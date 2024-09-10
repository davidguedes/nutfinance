import { Observable } from "rxjs";
import { BudgetForm } from "../model/budget.model";

export interface Orcamentos {
  getBudget(user_id: string): Observable<any>;
  updateBudget(data: BudgetForm): Observable<any>;
  getCategory(user_id: string): Observable<any>;
}
