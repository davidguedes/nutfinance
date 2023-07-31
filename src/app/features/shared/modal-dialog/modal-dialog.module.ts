import {
  NgModule,
  NO_ERRORS_SCHEMA,
  CUSTOM_ELEMENTS_SCHEMA
} from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptFormsModule, NativeScriptRouterModule } from '@nativescript/angular';

import { MODAL_DIALOG_COMPONENTS, ModalDialogComponent } from './components';

export const routes: Routes = [
  {
    path: 'dialog',
    component: ModalDialogComponent
  }
];

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes), NativeScriptFormsModule],
  declarations: [...MODAL_DIALOG_COMPONENTS],
  exports: [...MODAL_DIALOG_COMPONENTS],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
})
export class ModalDialogModule {}
