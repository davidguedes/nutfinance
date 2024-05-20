export interface FixedForm {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  value: number;
  type: string;
  date_inclusion: Date;
  description: string;
  tags?: string[] | [];
  status: boolean;
  user_id: string;
  total: number;
}
