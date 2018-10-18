import {Injectable} from '@angular/core';
import {CrudService} from '../shared/crud.service';
import {HttpClient} from '@angular/common/http';
import {API_URLS} from '../config/api.url.config';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class AdresseService implements CrudService{

  constructor(private http: HttpClient){}

  getAll(): Observable<any>{
    return this.http.get(API_URLS.ADRESSE_URL);
  }

  add(adresse): Observable<any>{
    return this.http.post(API_URLS.ADRESSE_URL, adresse);
  }
  update(adresse): Observable<any>{
    return this.http.put(API_URLS.ADRESSE_URL, adresse);
  }
  delete(id): Observable<any>{
    return this.http.delete(API_URLS.ADRESSE_URL +`/${id}`);
  }

  addAll(list): Observable<any>{
    return this.http.post(API_URLS.ADRESSE_URL + '/all', list);
  }

  getOne(id): Observable<any>{
    return this.http.get(API_URLS.ADRESSE_URL +`/${id}`);
  }
}
