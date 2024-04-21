import { TransacoesForm } from "../model/transacoes.model";

export interface Transacoes {
  saveData(data: TransacoesForm): void;
  getDataLocally(): TransacoesForm[];
  mergeData(existingData: TransacoesForm[], newData: TransacoesForm[]): TransacoesForm[];
  saveLocally(data: TransacoesForm[]): void;
}
