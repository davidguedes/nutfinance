import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FixasComponent } from './fixas.component';

const routes: Routes = [
  { path: '', component: FixasComponent, data: { title: 'NutFinance - Fixas'}},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FixasRoutingModule { }
