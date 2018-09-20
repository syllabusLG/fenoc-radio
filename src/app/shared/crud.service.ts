import {Observable} from 'rxjs/Observable';

export  interface CrudService {

  getAll(): Observable<any>;

  add(entity): Observable<any>;

  update(entity): Observable<any>;

  delete(id): Observable<any>;
}
