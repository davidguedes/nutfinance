import { HomeModule } from './home/home.module';
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadChildren: () => import('./home/home.module').then((m) => m.HomeModule), data: { title: 'NutFinance - Home'} },
  { path: 'transacoes', loadChildren: () => import('./transacoes/transacoes.module').then((m) => m.TransacoesModule), data: { title: 'NutFinance - Transações'} },
];
