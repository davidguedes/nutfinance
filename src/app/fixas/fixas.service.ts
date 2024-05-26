import { Injectable, inject } from '@angular/core';
import { enviroment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FixasFilter } from './fixas.interface';
import { Observable } from 'rxjs';
import { FixedForm } from '../model/fixed.model';

@Injectable({
  providedIn: 'root'
})
export class FixasService {
  private readonly API = `${enviroment.API}/fixed`
  protected http = inject(HttpClient);

  getFixed(first: number, rows: number, filters: FixasFilter, user_id: string): Observable<any> {
    let params = new HttpParams()
      .set('user_id', user_id)
      .set('first', first.toString())
      .set('rows', rows.toString())
      .set('type', filters.type)
      .set('sort', filters.sort)
      .set('status', filters.status);

    if (filters.description) {
      params = params.set('description', filters.description);
    }

    if (filters.day_inclusion) {
      params = params.set('day_inclusion', filters.day_inclusion);
    }

    if (filters.tags && filters.tags.length > 0) {
      params = params.set('tags', filters.tags.join(','));
    }

    return this.http.get(this.API, { params });
  }

  createFixed(data: FixedForm): Observable<any>{
    return this.http.post(`${this.API}/`, {data});
  }

  updateFixed(data: FixedForm): Observable<any>{
    return this.http.put(`${this.API}/`, {data});
  }

  deleteFixed(id: string): Observable<any>{
    return this.http.delete(`${this.API}/${id}`);
  }
}
