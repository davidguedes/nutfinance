import { Observable } from "rxjs";
import { FixedForm } from "../model/fixed.model";

export interface Fixas {
  getFixed(first: number, rows: number, filters: FixasFilter): Observable<{ totalRecords: number, records: FixedForm[] }>;
  //saveData(data: FixedForm): void;
  createFixed(data: FixedForm): Observable<any>;
  updateFixed(data: FixedForm): Observable<any>;
  deleteFixed(id: string): Observable<any>;
  //getDataLocally(): FixedForm[];
  //mergeData(existingData: FixedForm[], newData: FixedForm[]): FixedForm[];
  //saveLocally(data: FixedForm[]): void;
}

export interface FixasFilter {
  description: string,
  day_inclusion: number,
  tags: string[],
  type: string,
  status: boolean,
  sort: boolean,
  offset: number,
}
