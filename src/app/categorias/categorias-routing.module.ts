import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriasComponent } from './categorias.component';

const routes: Routes = [
  { path: '', component: CategoriasComponent, data: { title: 'NutFinance - Categorias'}},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriasRoutingModule { }
