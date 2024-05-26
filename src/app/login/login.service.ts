import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { enviroment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';

interface LoginResponse {
  token: string;
  user: any;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private readonly API = `${enviroment.API}/auth`
  protected http = inject(HttpClient);
  private tokenSubject: BehaviorSubject<string | null>;
  public token$: Observable<string | null>;
  public user: any = null;

  constructor() {
    const token = localStorage.getItem('token');
    this.tokenSubject = new BehaviorSubject<string | null>(token);
    this.token$ = this.tokenSubject.asObservable();
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.API}/login`, { email, password }).pipe(
      tap((response: any) => {
        this.setToken(response.token);
        this.user = response.user;

        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      })
    );
  }

  logout(): void {
    this.setToken(null);
    localStorage.removeItem('user');
  }

  getUser() {
    const user = this.user ? this.user : localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getToken(): string | null {
    return localStorage.getItem('token') ?? null;
  }

  isTokenExpired(token: string): boolean {
    const decodedToken: any = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decodedToken.exp < currentTime;
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if(!token)
      return false;

    return !this.isTokenExpired(token);
  }

  private setToken(token: string | null) {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
    this.tokenSubject.next(token);
  }
}
