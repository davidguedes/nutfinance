import { Observable } from "rxjs";
import { ClosureForm } from "../model/closure.model";

export interface Fechamentos {
  getClosures(first: number, rows: number, filters: ClosuresFilter, user_id: string): Observable<{ totalRecords: number, records: ClosureForm[] }>;
}

export interface ClosuresFilter {
  initialDate: Date,
  finalDate: Date;
}
