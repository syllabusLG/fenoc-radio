import {Observable} from 'rxjs';

export  interface CrudService {

  getAll(): Observable<any>;

  add(entity): Observable<any>;

  update(entity): Observable<any>;

  delete(id): Observable<any>;

  addAll(list): Observable<any>;

  getOne(id): Observable<any>;

  search(motCle:string, page:number, size:number): Observable<any>;
}
