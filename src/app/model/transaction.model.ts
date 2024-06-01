export interface TransactionForm {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  value: number;
  type: string;
  isInstallment: boolean;
  installmentNumber?: number;
  totalInstallmentNumber?: number;
  date_transaction: Date;
  description: string;
  tags?: string[] | [];
  user_id: string;
  date?: string;
  closing_id?: string;
}
