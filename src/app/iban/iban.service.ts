import {Injectable} from '@angular/core';
import {CrudService} from '../shared/crud.service';
import {API_URLS} from '../config/api.url.config';
import {Observable} from 'rxjs/Observable';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class IbanService implements CrudService{

  constructor(private http: HttpClient){}

  getAll(): Observable<any>{
    return this.http.get(API_URLS.IBAN_URL);
  }

  add(iban): Observable<any>{
    return this.http.post(API_URLS.IBAN_URL, iban);
  }

  update(iban): Observable<any>{
    return this.http.put(API_URLS.IBAN_URL, iban);
  }

  delete(id): Observable<any>{
    return this.http.delete(API_URLS.IBAN_URL +`/${id}`);
  }

  addAll(list): Observable<any>{
    return this.http.post(API_URLS.IBAN_URL + '/all', list);
  }

  getOne(id): Observable<any>{
    return this.http.get(API_URLS.IBAN_URL +`/${id}`);
  }
  search(motCle:string, page:number, size:number): Observable<any>{
    return this.http.get(API_URLS.ADRESSE_URL_SEARCH+'?mc='+motCle+'&size='+size+'&page='+page);
  }
}
