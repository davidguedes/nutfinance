import { Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { BudgetForm } from '../model/budget.model';
import { Orcamentos } from './orcamentos.interface';
import { OrcamentosFormComponent } from "./orcamentos-form/orcamentos-form.component";
import { UserForm } from '../model/user.model';
import { LoginService } from '../login/login.service';
import { catchError, lastValueFrom } from 'rxjs';
import { OrcamentosService } from './orcamentos.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-orcamentos',
  standalone: true,
  imports: [ButtonModule, OrcamentosFormComponent, ToastModule],
  template: `
    <div>
      <app-orcamentos-form (onSubmit)="updateBudget($event)"></app-orcamentos-form>
    </div>
    <p-toast position="top-center"></p-toast>
  `,
  styles: `
    .new-register {
      padding: 10px 20px;
      display: flex;
      align-items: center;
      justify-content: end;
    }
  `,
  providers: [MessageService]
})
export class OrcamentosComponent implements OnInit {
  private user: UserForm = {} as UserForm;
  protected authService: any = inject(LoginService);
  protected orcamentosService: Orcamentos = inject(OrcamentosService);
  protected messageService = inject(MessageService);

  ngOnInit(): void {
    this.user = this.authService.getUser();
  }

  async updateBudget(formulario: BudgetForm) {
    const dadosFormulario = formulario;
    formulario.user_id = this.user.id;

    const updateBudget = await lastValueFrom(this.orcamentosService.updateBudget(dadosFormulario).pipe(
      catchError(error => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao atualizar planejamento ' + error.error.message })
        return error;
      })
    ));
    let textDetail = "Sucesso ao atualizar planejamento";

    this.messageService.add({ severity: 'success', summary: 'Success', detail: textDetail });
  }
}
