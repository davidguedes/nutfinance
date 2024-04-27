import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DespesasComponent } from './despesas.component';

const routes: Routes = [
  { path: '', component: DespesasComponent, data: { title: 'NutFinance - Despesas'}},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DespesasRoutingModule { }
