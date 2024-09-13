import { Observable } from "rxjs";

export interface Perfil {
  reset(user_id: string): Observable<any>;
  update(data: any): Observable<any>;
}
