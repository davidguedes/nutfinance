import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule, NativeScriptFormsModule, NativeScriptRouterModule } from '@nativescript/angular';

import { ModalDialogModule } from './modal-dialog/modal-dialog.module';

const MODULES = [
  NativeScriptCommonModule,
  NativeScriptFormsModule,
  NativeScriptRouterModule,
  ModalDialogModule
];

@NgModule({
  imports: [...MODULES],
  exports: [...MODULES],
  schemas: [NO_ERRORS_SCHEMA],
})
export class SharedModule {}
