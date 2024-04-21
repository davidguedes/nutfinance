import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransacoesComponent } from './transacoes.component';

const routes: Routes = [
  { path: '', component: TransacoesComponent, data: { title: 'NutFinance - Transações'}},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransacoesRoutingModule { }
