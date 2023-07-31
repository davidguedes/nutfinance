import {
  NgModule,
  NO_ERRORS_SCHEMA,
  CUSTOM_ELEMENTS_SCHEMA
} from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule } from '@nativescript/angular';

import { SharedModule } from '../shared/shared.module';
import { NOVA_TRANSACAO_COMPONENTS, NovaTransacaoComponent } from './components';

export const routes: Routes = [
  {
    path: '',
    component: NovaTransacaoComponent
  }
];

@NgModule({
  imports: [SharedModule, NativeScriptRouterModule.forChild(routes)],
  declarations: [...NOVA_TRANSACAO_COMPONENTS],
  exports: [...NOVA_TRANSACAO_COMPONENTS],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
})
export class NovaTransacaoModule {}
