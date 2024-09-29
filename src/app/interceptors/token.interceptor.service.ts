import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { LoginService } from '../login/login.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(private loginService: LoginService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token = this.loginService.getAccessToken();

    let request = req;

    if (token) {
      // Adiciona o token no header
      request = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log('Deu ruim hein: ', token);
        if (error.status === 401 && (error.error.message === 'Token expirado' || error.error.message === 'Token inválido')) {
          return this.handle401Error(request, next);
        }
        return throwError(error);
      })
    );
  }

  private handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      // Tenta renovar o token
      return this.loginService.refreshToken().pipe(
        switchMap((newToken: any) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(newToken.accessToken);

          // Atualiza o request original com o novo token
          return next.handle(this.addTokenToRequest(req, newToken.accessToken));
        }),
        catchError((err) => {
          this.isRefreshing = false;
          this.loginService.logout();
          this.router.navigate(['/login']);
          return throwError(err);
        })
      );
    } else {
      // Se já está tentando renovar, fila as requisições até que o token seja atualizado
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(token => next.handle(this.addTokenToRequest(req, token!)))
      );
    }
  }

  private addTokenToRequest(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

