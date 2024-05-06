import { Injectable, inject } from '@angular/core';
import { TransactionForm } from '../model/transaction.model';
import { enviroment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TransacoesFilter } from './transacoes.interface';

@Injectable({
  providedIn: 'root'
})
export class TransacoesService {
  private readonly API = `${enviroment.API}/transaction`
  protected http = inject(HttpClient);

  getTransactions(filters: TransacoesFilter): Observable<any> {
    console.log('filters: ', filters);
    let params = `?first=${filters.offset}`;
    params += `&type=${filters.type}`
    params += `&sort=${filters.sort}`

    if(filters.initial_date_transaction) {
      let initialDate = filters.initial_date_transaction.toLocaleDateString('pt-BR');
      let partesData = initialDate.split('/');

      // Formatando a data no padrão americano 'mm/dd/yyyy'
      let dataUS = partesData[1] + '/' + partesData[0] + '/' + partesData[2];
      params += `&initial_date_transaction=${dataUS}`
    }

    if(filters.final_date_transaction) {
      let finalDate = filters.final_date_transaction.toLocaleDateString('pt-BR');
      let partesData = finalDate.split('/');

      // Formatando a data no padrão americano 'mm/dd/yyyy'
      let dataUS = partesData[1] + '/' + partesData[0] + '/' + partesData[2];
      params += `&final_date_transaction=${dataUS}`
    }

    if(filters.tags?.length > 0) {
      params += `&tags=${filters.tags}`
    }

    return this.http.get(`${this.API}${params}`);
  }

  createTransaction(data: TransactionForm): Observable<any>{
    return this.http.post(`${this.API}/`, {data});
  }

  updateTransaction(data: TransactionForm): Observable<any>{
    return this.http.put(`${this.API}/`, {data});
  }

  deleteTransaction(id: string): Observable<any>{
    return this.http.delete(`${this.API}/${id}`);
  }

  saveData(data: TransactionForm): void {
    // Recupere os dados existentes
    const existingData: any[] = this.getDataLocally();

    // Combine os dados existentes com os novos dados
    const updatedData = this.mergeData(existingData, [data]);

    // Salve os dados atualizados
    this.saveLocally(updatedData);
  }

  getDataLocally(): TransactionForm[] {
    // Recupere os dados existentes do armazenamento local
    const jsonData = localStorage.getItem('transacoes');
    return jsonData ? JSON.parse(jsonData) : [];
  }

  mergeData(existingData: TransactionForm[], newData: TransactionForm[]): TransactionForm[] {
    // Combine os dados existentes com os novos dados
    // Aqui você pode implementar a lógica de mesclar ou sobrescrever os valores conforme necessário
    // Este exemplo apenas sobrescreve os dados existentes com os novos dados
    return [...existingData, ...newData];
  }

  saveLocally(data: TransactionForm[]): void {
    // Salve os dados atualizados no armazenamento local
    localStorage.setItem('transacoes', JSON.stringify(data));
  }
}
