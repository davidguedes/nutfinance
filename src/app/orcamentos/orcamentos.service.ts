import { inject, Injectable } from '@angular/core';
import { BudgetForm } from '../model/budget.model';
import { Observable } from 'rxjs';
import { enviroment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrcamentosService {
  private readonly API = `${enviroment.API}/budget`
  protected http = inject(HttpClient);

  constructor() { }

  getBudget(user_id: string): Observable<any>{
    return this.http.get(`${this.API}/${user_id}`);
  }

  updateBudget(data: BudgetForm): Observable<any>{
    return this.http.put(`${this.API}/`, {data});
  }

  getCategory(user_id: string): Observable<any>{
    return this.http.get(`${this.API}/getCategory/${user_id}`);
  }
}
