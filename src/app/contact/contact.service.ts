import {CrudService} from '../shared/crud.service';
import {API_URLS} from '../config/api.url.config';
import {Observable} from 'rxjs/Observable';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable()
export  class ContactService implements CrudService{

  constructor(private http: HttpClient){}

  getAll(): Observable<any>{
    return this.http.get(API_URLS.CONTACT_URL);
  }

  add(contact): Observable<any>{
    return this.http.post(API_URLS.CONTACT_URL, contact);
  }
  update(contact): Observable<any>{
    return this.http.put(API_URLS.CONTACT_URL, contact);
  }
  delete(id): Observable<any>{
    return this.http.delete(API_URLS.CONTACT_URL +`/${id}`);
  }

  addAll(list): Observable<any>{
    return this.http.post(API_URLS.CONTACT_URL + '/all', list);
  }

  getOne(id): Observable<any>{
    return this.http.get(API_URLS.CONTACT_URL +`/${id}`);
  }
}
