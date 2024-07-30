import { booleanAttribute, Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CategoriasFormComponent } from '../categorias-form/categorias-form.component';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { CategoryForm } from '../../model/category.model';
import { CategoriasService } from '../categorias.service';
import { LoginService } from '../../login/login.service';
import { UserForm } from '../../model/user.model';
import { Categorias } from '../categorias.interface';
import { catchError, lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-categorias-modal',
  standalone: true,
  imports: [DialogModule, ToastModule, CategoriasFormComponent],
  providers: [MessageService],
  template: `
    <p-dialog header="Categorias" [(visible)]="visible" (onHide)="toggleVisible.emit({visible: false, alter: alter})" [draggable]="false" [resizable]="false" [modal]="true" [style]="{width: '50vw'}" [breakpoints]="{ '960px': '75vw', '660px': '90vw' }">
      <app-categorias-form (onSubmit)="createCategoria($event)" [edit]="categoryEdit" (closeModal)="close($event)"></app-categorias-form>
    </p-dialog>
    <p-toast></p-toast>
  `,
  styles: `
  `
})
export class CategoriasModalComponent implements OnInit {
  @Input() categoryEdit!: CategoryForm | undefined;
  @Input({ transform: booleanAttribute }) visible: boolean = false;
  @Output() toggleVisible = new EventEmitter();
  protected categoryService: Categorias = inject(CategoriasService);
  protected messageService = inject(MessageService);
  protected authService: any = inject(LoginService);
  private user: UserForm = {} as UserForm;
  alter: boolean = false;

  ngOnInit(): void {
    this.user = this.authService.getUser();
  }

  async createCategoria(formulario: CategoryForm) {
    const dadosFormulario = formulario;
    formulario.user_id = this.user.id;

    let textDetail = ``;
    //this.transactionService.saveData(dadosFormulario)
    if(dadosFormulario.id) {
      const updateCategory = await lastValueFrom(this.categoryService.updateCategory(dadosFormulario).pipe(
        catchError(error => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao atualizar cadastro ' + error.error.message })
          return error;
        })
      ));
      textDetail = "Sucesso ao atualizar categoria";
    } else {
      const createTransaction = await lastValueFrom(this.categoryService.createCategory(dadosFormulario).pipe(
        catchError(error => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao realizar cadastro ' + error.error.message })
          return error;
        })
      ));
      textDetail = "Sucesso ao incluir categoria";
    }

    this.messageService.add({ severity: 'success', summary: 'Success', detail: textDetail });
    this.alter = true;
    this.close(true);
  }

  close(close: boolean) {
    this.visible = close === true ? false : true;
  }
}
