export interface CategoryForm {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  status: boolean;
  user_id: string;
}

export interface CategoryDropDown {
  id: string;
  name: string;
}
