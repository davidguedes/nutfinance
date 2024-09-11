import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { authGuard } from './guards/auth.guard';
import { RegisterComponent } from './register/register.component';
import { OfflinePageComponent } from './offline-page/offline-page.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, data: { title: 'NutFinance - Login'} },
  { path: 'register', component: RegisterComponent, data: { title: 'NutFinance - Sign Up'} },
  //{ path: 'categorias', canActivate: [authGuard], loadChildren: () => import('./categorias/categorias.module').then((m) => m.CategoriasModule), data: { title: 'NutFinance - Categorias'} },
  { path: 'transacoes', canActivate: [authGuard], loadChildren: () => import('./transacoes/transacoes.module').then((m) => m.TransacoesModule), data: { title: 'NutFinance - Transações'} },
  { path: 'orcamento', canActivate: [authGuard], loadChildren: () => import('./orcamentos/orcamentos.module').then((m) => m.OrcamentosModule), data: { title: 'NutFinance - Orçamentos'} },
  { path: 'fixas', canActivate: [authGuard], loadChildren: () => import('./fixas/fixas.module').then((m) => m.FixasModule), data: { title: 'NutFinance - Fixas'} },
  { path: 'perfil', canActivate: [authGuard], loadChildren: () => import('./perfil/perfil.module').then((m) => m.PerfilModule), data: { title: 'NutFinance - Perfil'} },
  { path: '', loadChildren: () => import('./home/home.module').then((m) => m.HomeModule), data: { title: 'NutFinance - Home'}, pathMatch: 'full'},
  { path: 'offline', component: OfflinePageComponent },
  { path: '**', redirectTo: '/login' },
];
