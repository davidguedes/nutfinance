export interface TransacoesForm {
  id_transacao: string;
  id_usuario: string;
  valor: number;
  tipo: string;
  recorrencia: boolean;
  numero_recorrencia?: number;
  data_transacao: Date;
  descricao: string;
  tags?: string[] | [];
}
