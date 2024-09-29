import { inject, Injectable } from '@angular/core';
import { enviroment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ClosuresFilter } from './fechamentos.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FechamentosService {
  private readonly API = `${enviroment.API}/closure`;
  protected http = inject(HttpClient);

  getClosures(first: number, rows: number, filters: ClosuresFilter, user_id: string): Observable<any> {
    let params = new HttpParams()
      .set('user_id', user_id)
      .set('first', first.toString())
      .set('rows', rows.toString());

      if (filters.initialDate) {
        const initialDate = this.formatDate(filters.initialDate);
        params = params.set('initial_date', initialDate);
      }

      if (filters.finalDate) {
        const finalDate = this.formatDate(filters.finalDate);
        params = params.set('final_date', finalDate);
      }

    return this.http.get(this.API, { params });
  }

  private formatDate(date: Date): string {
    const [day, month, year] = date.toLocaleDateString('pt-BR').split('/');
    return `${month}/${day}/${year}`;
  }
}
