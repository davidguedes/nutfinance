import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FechamentosComponent } from './fechamentos.component';

const routes: Routes = [
  { path: '', component: FechamentosComponent, data: { title: 'NutFinance - Fechamentos'}},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FechamentosRoutingModule { }
