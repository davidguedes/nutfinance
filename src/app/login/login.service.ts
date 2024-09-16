import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
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
  private accessToken = new BehaviorSubject<string | null>(null);
  public user: any = null;

  constructor() {
    const token = localStorage.getItem('accessToken');
    if (token) {
      this.accessToken.next(token);
    }
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.API}/login`, { email, password }).pipe(
      tap((response: any) => {
        this.user = response.user;
        localStorage.setItem('user', JSON.stringify(response.user));

        this.accessToken.next(response.token);
        localStorage.setItem('accessToken', response.token);

        localStorage.setItem('refreshToken', response.refreshToken);
      }),
      catchError(error => {
        //console.error('Login error: ', error);
        // Process the error and return an Observable error
        return throwError(() => new Error(error.error.message));
      })
    );
  }

  logout(): void {
    this.accessToken.next(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  getUser() {
    const user = this.user ? this.user : localStorage.getItem('user');
    return user ? typeof(user) == 'string' ? JSON.parse(user) : user : null;
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken') ?? null;
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

  refreshToken(): Observable<string> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http.post(`${this.API}/refresh-token`, { refreshToken }).pipe(
      tap((response: any) => {
        this.accessToken.next(response.accessToken); // Atualiza o access token
        localStorage.setItem('accessToken', response.token);
      })
    );
  }

  getAccessToken(): string | null {
    return this.accessToken.value;
  }

  isAuthenticated(): boolean {
    return this.getAccessToken() !== null;
  }
}
