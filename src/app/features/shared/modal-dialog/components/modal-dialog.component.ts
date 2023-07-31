import { Component, ViewContainerRef } from '@angular/core';
import { TextField, Utils } from '@nativescript/core';
import { ModalDialogOptions, ModalDialogParams, ModalDialogService } from "@nativescript/angular";

import { TransacaoModel } from '~/app/core/models/transacao.model';
import { TransacaoService } from '~/app/core';

@Component({
  moduleId: module.id,
  selector: 'app-modal-dialog',
  templateUrl: './modal-dialog.component.html',
  styleUrls: ['./modal-dialog.component.scss'],
})
export class ModalDialogComponent {
  protected title: string;
  protected transacao: TransacaoModel = {id: null, valor: null, tipo: ''};

  constructor(
    private transacaoService: TransacaoService,
    private modalService: ModalDialogService,
    private viewContainerRef: ViewContainerRef,
    private _params: ModalDialogParams
  ) { }

  ngOnInit(): void {
    this.title = 'Nova Transação';
  }

  public show() {
    const options: ModalDialogOptions = {
        viewContainerRef: this.viewContainerRef
    };

    this.modalService.showModal(ModalDialogComponent, options);
  }

  onClose(): void {
    this._params.closeCallback("return value");
  }

  addChamado(): void {
    this.transacao.id = this.datatimeRandom();
    this.transacaoService.insertTransacao(this.transacao);
    this.onClose();
  }

  onReturnPress(args): void {
    // returnPress event will be triggered when user submits a value
    const textField = <TextField>args.object;

    // Gets or sets the placeholder text.
    console.log(textField.hint);
    // Gets or sets the input text.
    console.log(textField.text);
    // Gets or sets the secure option (e.g. for passwords).
    console.log(textField.secure);

    // Gets or sets the soft keyboard type. Options: "datetime" | "phone" | "number" | "url" | "email"
    console.log(textField.keyboardType);
    // Gets or sets the soft keyboard return key flavor. Options: "done" | "next" | "go" | "search" | "send"
    console.log(textField.returnKeyType);
    // Gets or sets the autocapitalization type. Options: "none" | "words" | "sentences" | "allcharacters"
    console.log(textField.autocapitalizationType);

    // Gets or sets a value indicating when the text property will be updated.
    console.log(textField.updateTextTrigger);
    // Gets or sets whether the instance is editable.
    console.log(textField.editable);
    // Enables or disables autocorrection.
    console.log(textField.autocorrect);
    // Limits input to a certain number of characters.
    console.log(textField.maxLength);

    Utils.setTimeout(() => {
      textField.dismissSoftInput(); // Hides the soft input method, ususally a soft keyboard.
    }, 100);
  }

  onFocus(args): void {
  // focus event will be triggered when the users enters the TextField
    const textField = <TextField>args.object;
    console.log('textField: ', textField.text);
    console.log('textField: ', textField.id);
  }

  onBlur(args) {
  // blur event will be triggered when the user leaves the TextField
    const textField = <TextField>args.object;
  }

  datatimeRandom(): number {
    return(Math.trunc((new Date().getTime() / 1000) * Math.random() / 999999));
  }
}
