import { Injectable, inject } from '@angular/core';
import { TransactionForm } from '../model/transaction.model';
import { enviroment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TransacoesFilter } from './transacoes.interface';

@Injectable({
  providedIn: 'root'
})
export class TransacoesService {
  private readonly API = `${enviroment.API}/transaction`
  protected http = inject(HttpClient);

  getTransactions(filters: TransacoesFilter, user_id: string): Observable<any> {
    let params = new HttpParams()
      .set('user_id', user_id)
      .set('first', filters.offset.toString())
      .set('type', filters.type)
      .set('sort', filters.sort);

    if (filters.initial_date_transaction) {
      const initialDate = this.formatDate(filters.initial_date_transaction);
      params = params.set('initial_date_transaction', initialDate);
    }

    if (filters.final_date_transaction) {
      const finalDate = this.formatDate(filters.final_date_transaction);
      params = params.set('final_date_transaction', finalDate);
    }

    if (filters.tags && filters.tags.length > 0) {
      params = params.set('tags', filters.tags.join(','));
    }

    return this.http.get(this.API, { params });
  }

  private formatDate(date: Date): string {
    const [day, month, year] = date.toLocaleDateString('pt-BR').split('/');
    return `${month}/${day}/${year}`;
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
