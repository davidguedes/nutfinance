export interface TransactionForm {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  value: number;
  type: string;
  recurrence: boolean;
  number_recurrence?: number;
  date_transaction: Date;
  description: string;
  tags?: string[] | [];
  user_id: string;
}
