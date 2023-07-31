import {
  NgModule,
  NO_ERRORS_SCHEMA,
  CUSTOM_ELEMENTS_SCHEMA
} from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule } from '@nativescript/angular';

import { SharedModule } from '../shared/shared.module';
import { TRANSACOES_COMPONENTS, TransacoesComponent } from './components';

export const routes: Routes = [
  {
    path: 'transacoes',
    outlet: 'transacoes',
    component: TransacoesComponent
  }
];

@NgModule({
  imports: [SharedModule, NativeScriptRouterModule.forChild(routes)],
  declarations: [...TRANSACOES_COMPONENTS],
  exports: [...TRANSACOES_COMPONENTS],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
})
export class TransacoesModule {}
