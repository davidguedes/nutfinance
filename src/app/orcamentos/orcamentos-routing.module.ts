import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrcamentosComponent } from './orcamentos.component';

const routes: Routes = [
  { path: '', component: OrcamentosComponent, data: { title: 'NutFinance - Planejamento'}},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrcamentosRoutingModule { }
