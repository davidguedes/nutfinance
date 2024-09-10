import { inject, Injectable } from '@angular/core';
import { enviroment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CategoryForm } from '../model/category.model';
import { Observable } from 'rxjs';
import { CategoriasFilter } from './categorias.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {
  private readonly API = `${enviroment.API}/category`
  protected http = inject(HttpClient);

  getCategory(first: number, rows: number, filters: CategoriasFilter, user_id: string): Observable<any> {
    let params = new HttpParams()
      .set('user_id', user_id)
      .set('first', first.toString())
      .set('rows', rows.toString());

      if (filters.name) {
        params = params.set('name', filters.name);
      }

    return this.http.get(this.API, { params });
  }

  getCategoryByUser(user_id: string): Observable<any> {
    let params = new HttpParams()
      .set('user_id', user_id);

    return this.http.get(`${this.API}/byUser/`, { params });
  }

  createCategory(data: CategoryForm): Observable<any>{
    return this.http.post(`${this.API}/`, {data});
  }

  updateCategory(data: CategoryForm): Observable<any>{
    return this.http.put(`${this.API}/`, {data});
  }

  deleteCategory(id: string): Observable<any>{
    return this.http.delete(`${this.API}/${id}`);
  }
}
