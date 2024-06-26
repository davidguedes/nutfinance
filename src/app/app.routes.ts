import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, data: { title: 'NutFinance - Login'} },
  { path: 'transacoes', canActivate: [authGuard], loadChildren: () => import('./transacoes/transacoes.module').then((m) => m.TransacoesModule), data: { title: 'NutFinance - Transações'} },
  { path: 'fixas', canActivate: [authGuard], loadChildren: () => import('./fixas/fixas.module').then((m) => m.FixasModule), data: { title: 'NutFinance - Fixas'} },
  { path: 'perfil', canActivate: [authGuard], loadChildren: () => import('./perfil/perfil.module').then((m) => m.PerfilModule), data: { title: 'NutFinance - Perfil'} },
  { path: '', loadChildren: () => import('./home/home.module').then((m) => m.HomeModule), data: { title: 'NutFinance - Home'}, pathMatch: 'full'},
  { path: '**', redirectTo: '/login' },
];
