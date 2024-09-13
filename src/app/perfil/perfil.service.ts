import { inject, Injectable } from '@angular/core';
import { enviroment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {
  private readonly API = `${enviroment.API}/auth`
  protected http = inject(HttpClient);

  constructor() { }

  reset(user_id: string): Observable<any>{
    return this.http.post(`${this.API}/reset`, {user_id});
  }

  update(data: any): Observable<any>{
    return this.http.put(`${this.API}/update`, {data});
  }
}
