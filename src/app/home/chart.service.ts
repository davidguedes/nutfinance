import { Injectable, inject } from '@angular/core';
import { enviroment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChartService {
  private readonly API = `${enviroment.API}/chart`
  protected http = inject(HttpClient);

  getFixed(): Observable<any>{
    return this.http.get(`${this.API}/fixed`);
  }

  getProfit(): Observable<any>{
    return this.http.get(`${this.API}/profit`);
  }
}
