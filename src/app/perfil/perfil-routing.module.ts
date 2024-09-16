import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PerfilDataComponent } from './perfil-data/perfil-data.component';

const routes: Routes = [
  { path: '', component: PerfilDataComponent, data: { title: 'NutFinance - Perfil'}},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PerfilRoutingModule { }
