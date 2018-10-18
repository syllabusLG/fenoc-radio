import {CrudService} from '../shared/crud.service';
import {Observable} from 'rxjs/Observable';
import {API_URLS} from '../config/api.url.config';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';


@Injectable()
export class IndividusService implements CrudService{

  constructor(private http: HttpClient){}

  getAll(): Observable<any>{
    return this.http.get(API_URLS.INDIVIDUS_URL);
  }

  add(individus): Observable<any>{
    return this.http.post(API_URLS.INDIVIDUS_URL, individus);
  }
  update(individus): Observable<any>{
    return this.http.put(API_URLS.INDIVIDUS_URL, individus);
  }
  delete(id): Observable<any>{
    return this.http.delete(API_URLS.INDIVIDUS_URL +`/${id}`);
  }

  addAll(list): Observable<any>{
    return this.http.post(API_URLS.INDIVIDUS_URL + '/all', list);
  }

  getOne(id): Observable<any>{
    return this.http.get(API_URLS.INDIVIDUS_URL +`/${id}`);
  }

}
