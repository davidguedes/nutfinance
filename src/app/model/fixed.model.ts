export interface FixedForm {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  value: number;
  type: string;
  day_inclusion: number;
  description: string;
  tags?: string[] | [];
  budgetCategory_id: string;
  status: boolean;
  user_id: string;
  total: number;
}
