import {Injectable} from '@angular/core';
import {CrudService} from '../shared/crud.service';
import {API_URLS} from '../config/api.url.config';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class PositionService implements CrudService{

  constructor(private http: HttpClient){}

  getAll(): Observable<any>{
    return this.http.get(API_URLS.POSITION_URL);
  }

  add(position): Observable<any>{
    return this.http.post(API_URLS.POSITION_URL, position);
  }

  update(position): Observable<any>{
    return this.http.put(API_URLS.POSITION_URL, position);
  }

  delete(id): Observable<any>{
    return this.http.delete(API_URLS.POSITION_URL +`/${id}`);
  }

  addAll(list): Observable<any>{
    return this.http.post(API_URLS.POSITION_URL + '/all', list);
  }

  getOne(id): Observable<any>{
    return this.http.get(API_URLS.POSITION_URL +`/${id}`);
  }
  search(motCle:string, page:number, size:number): Observable<any>{
    return this.http.get(API_URLS.POSITION_URL_SEARCH +'?mc='+motCle+'&size='+size+'&page='+page);
  }
}
