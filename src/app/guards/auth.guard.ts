import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../login/login.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService: any = inject(LoginService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  authService.logout();
  router.navigate(['/login']);
  return false;
};
