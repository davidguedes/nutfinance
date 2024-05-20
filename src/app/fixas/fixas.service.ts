import { Injectable, inject } from '@angular/core';
import { enviroment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { FixasFilter } from './fixas.interface';
import { Observable } from 'rxjs';
import { FixedForm } from '../model/fixed.model';

@Injectable({
  providedIn: 'root'
})
export class FixasService {
  private readonly API = `${enviroment.API}/fixed`
  protected http = inject(HttpClient);

  getFixed(first: number, rows: number, filters: FixasFilter): Observable<any> {
    console.log('rows: ', rows);
    console.log('first: ', first);
    console.log('filters: ', filters);
    let params = `?first=${first}`;
    params += `&rows=${rows}`;
    params += `&type=${filters.type}`
    params += `&sort=${filters.sort}`
    params += `&status=${filters.status}`

    if(filters.description) {
      params += `&description=${filters.description}`
    }

    if(filters.date_inclusion) {
      let dateInclusion = filters.date_inclusion.toLocaleDateString('pt-BR');
      let partesData = dateInclusion.split('/');

      // Formatando a data no padrão americano 'mm/dd/yyyy'
      let dataUS = partesData[1] + '/' + partesData[0] + '/' + partesData[2];
      params += `&inclusion_date=${dataUS}`
    }

    if(filters.tags?.length > 0) {
      params += `&tags=${filters.tags}`
    }

    return this.http.get(`${this.API}${params}`);
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