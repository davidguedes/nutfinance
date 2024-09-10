export interface BudgetForm {
  id: string;
  totalIncome: number;
  totalExpense: number;
  categories: BudgetCategoryForm[];
  user_id: string;
}

export interface BudgetCategoryForm {
  id: string;
  budget_id: string;
  type: string;
  category: string;
  amount: number;
}

export interface BudgetDropDown {
  id: string;
  name: string;
}

export interface BudgetDropDown {
  id: string;
  category: string;
}
