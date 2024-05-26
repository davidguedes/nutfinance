import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '../guards/auth.guard';
import { PerfilDataComponent } from './perfil-data/perfil-data.component';

const routes: Routes = [
  { path: '', canActivate: [authGuard], component: PerfilDataComponent, data: { title: 'NutFinance - Perfil'}},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PerfilRoutingModule { }
