import { Injectable } from '@angular/core';
import { TransacoesForm } from '../model/transacoes.model';

@Injectable({
  providedIn: 'root'
})
export class TransacoesService {
  saveData(data: TransacoesForm): void {
    // Recupere os dados existentes
    const existingData: any[] = this.getDataLocally();

    // Combine os dados existentes com os novos dados
    const updatedData = this.mergeData(existingData, [data]);

    // Salve os dados atualizados
    this.saveLocally(updatedData);
  }

  getDataLocally(): TransacoesForm[] {
    // Recupere os dados existentes do armazenamento local
    const jsonData = localStorage.getItem('transacoes');
    return jsonData ? JSON.parse(jsonData) : [];
  }

  mergeData(existingData: TransacoesForm[], newData: TransacoesForm[]): TransacoesForm[] {
    // Combine os dados existentes com os novos dados
    // Aqui você pode implementar a lógica de mesclar ou sobrescrever os valores conforme necessário
    // Este exemplo apenas sobrescreve os dados existentes com os novos dados
    return [...existingData, ...newData];
  }

  saveLocally(data: TransacoesForm[]): void {
    // Salve os dados atualizados no armazenamento local
    localStorage.setItem('transacoes', JSON.stringify(data));
  }
}
