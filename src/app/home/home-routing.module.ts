import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { authGuard } from '../guards/auth.guard';

const routes: Routes = [
  { path: '', canActivate: [authGuard], component: HomeComponent, data: { title: 'NutFinance - Home'}},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
