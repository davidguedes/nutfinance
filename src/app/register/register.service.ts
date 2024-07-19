import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { enviroment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private readonly API = `${enviroment.API}/user`

  protected http = inject(HttpClient);

  constructor() { }

  register(name: string, email: string, password: string, closing_date: number): Observable<any> {
    return this.http.post(`${this.API}/`, { name, email, password, closing_date });
  }
}
