import {CrudService} from '../shared/crud.service';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {API_URLS} from '../config/api.url.config';

@Injectable()
export class CompteService implements CrudService{

  constructor(private http: HttpClient){}

  getAll(): Observable<any>{
    return this.http.get(API_URLS.COMPTE_URL);
  }

  add(compte): Observable<any>{
    return this.http.post(API_URLS.COMPTE_URL, compte);
  }
  update(compte): Observable<any>{
    return this.http.put(API_URLS.COMPTE_URL, compte);
  }
  delete(id): Observable<any>{
    return this.http.delete(API_URLS.COMPTE_URL +`/${id}`);
  }

  addAll(list): Observable<any>{
    return this.http.post(API_URLS.COMPTE_URL + '/all', list);
  }

  getOne(id): Observable<any>{
    return this.http.get(API_URLS.COMPTE_URL +`/${id}`);
  }
  search(motCle:string, page:number, size:number): Observable<any>{
    return this.http.get(API_URLS.ADRESSE_URL_SEARCH+'?mc='+motCle+'&size='+size+'&page='+page);
  }
}
