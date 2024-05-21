import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false); // Inicializa com false

  isLoggedIn$ = this.isLoggedInSubject.asObservable(); // Expondo como um Observable

  constructor() { }

  login(email: string, password: string): boolean {
    // Aqui você pode adicionar sua lógica de autenticação real, como chamar um serviço de API
    if (email === 'd2vid.guedes@gmail.com' && password === 'admin') {
      localStorage.setItem('isLoggedIn', 'true');
      this.isLoggedInSubject.next(true); // Atualiza o valor para true
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem('isLoggedIn');
    this.isLoggedInSubject.next(false); // Atualiza o valor para false
  }

  // Método para verificar se o usuário está autenticado
  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }
}
