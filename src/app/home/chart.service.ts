import { Injectable, inject } from '@angular/core';
import { enviroment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChartService {
  private readonly API = `${enviroment.API}/chart`
  protected http = inject(HttpClient);

  getFixed(user_id: string): Observable<any> {
    let httpParams = new HttpParams();
    httpParams = httpParams.set('user_id', user_id);

    /*if (params) {
      Object.keys(params).forEach(key => {
        httpParams = httpParams.set(key, params[key]);
      });
    }*/

    return this.http.get(`${this.API}/fixed`, { params: httpParams });
  }

  getProfit(user_id: string): Observable<any> {
    let httpParams = new HttpParams();
    httpParams = httpParams.set('user_id', user_id);

    return this.http.get(`${this.API}/profit`, { params: httpParams });
  }

  getSpendingCategory(user_id: string): Observable<any> {
    let httpParams = new HttpParams();
    httpParams = httpParams.set('user_id', user_id);

    return this.http.get(`${this.API}/spendingCategory`, { params: httpParams });
  }
}
