import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadChildren: () => import('./home/home.module').then((m) => m.HomeModule), data: { title: 'NutFinance - Home'} },
  { path: 'transacoes', loadChildren: () => import('./transacoes/transacoes.module').then((m) => m.TransacoesModule), data: { title: 'NutFinance - Transações'} },
  { path: 'despesas', loadChildren: () => import('./despesas/despesas.module').then((m) => m.DespesasModule), data: { title: 'NutFinance - Despesas'} },
  { path: 'perfil', loadChildren: () => import('./perfil/perfil.module').then((m) => m.PerfilModule), data: { title: 'NutFinance - Perfil'} },
];
