import { Component } from '@angular/core';
import { setStatusBarColor } from '../../../utils';

@Component({
  moduleId: module.id,
  selector: 'app-nova-transacao',
  templateUrl: './nova-transacao.component.html'
})
export class NovaTransacaoComponent {

  ngOnInit() {
    setStatusBarColor('dark', '#97d9e9');
  }
}
