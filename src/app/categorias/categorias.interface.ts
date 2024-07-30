import { Observable } from "rxjs";
import { CategoryForm } from "../model/category.model";

export interface Categorias {
  getCategory(first: number, rows: number, filters: CategoriasFilter, user_id: string): Observable<{ totalRecords: number, records: CategoryForm[] }>;
  createCategory(data: CategoryForm): Observable<any>;
  updateCategory(data: CategoryForm): Observable<any>;
  deleteCategory(id: string): Observable<any>;
}

export interface CategoriasFilter {
  name: string,
  sort: boolean,
}
