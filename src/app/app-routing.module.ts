import { NgModule } from '@angular/core'
import { Routes } from '@angular/router'
import { NativeScriptRouterModule } from '@nativescript/angular'

const routes: Routes = [
  {
    path: '',
    redirectTo: '/(home:home//transacoes:transacoes)',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./features/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'transacoes',
    loadChildren: () =>
      import('./features/transacoes/transacoes.module').then(m => m.TransacoesModule)
  },
  {
    path: 'nova-transacao',
    loadChildren: () =>
      import('./features/nova-transacao/nova-transacao.module').then(m => m.NovaTransacaoModule)
  },
  {
    path: 'modal-dialog',
    loadChildren: () =>
      import('./features/shared/modal-dialog/modal-dialog.module').then(m => m.ModalDialogModule)
  },
]

@NgModule({
  imports: [NativeScriptRouterModule.forRoot(routes)],
  exports: [NativeScriptRouterModule],
})
export class AppRoutingModule {}
