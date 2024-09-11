import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class OfflineInterceptor implements HttpInterceptor {

  constructor(private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!navigator.onLine) {
      // Se estiver offline, redireciona para uma página de erro
      this.router.navigate(['/offline']);
      return throwError({ error: 'No internet connection' });
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (!navigator.onLine) {
          // Se a conexão for perdida durante a requisição
          this.router.navigate(['/offline']);
        }
        return throwError(error);
      })
    );
  }
}
