import {CrudService} from '../shared/crud.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {API_URLS} from '../config/api.url.config';
import {Injectable} from '@angular/core';

@Injectable()
export class UserService implements CrudService{

  constructor(private http: HttpClient){}

  getAll(): Observable<any>{
    return this.http.get(API_URLS.CRUD_USER_URL);
  }

  add(user): Observable<any> {
    return this.http.post(API_URLS.CRUD_USER_URL, user);
  }

  update(user): Observable<any> {
    return this.http.put(API_URLS.CRUD_USER_URL, user);
  }

  delete(id): Observable<any> {
    return this.http.delete(API_URLS.CRUD_USER_URL + `/${id}`);
  }

  addAll(list): Observable<any>{
    return this.http.post(API_URLS.CRUD_USER_URL + '/all', list);
  }

  getOne(id): Observable<any>{
    return this.http.get(API_URLS.CRUD_USER_URL +`/${id}`);
  }
  search(motCle:string, page:number, size:number): Observable<any>{
    return this.http.get(API_URLS.ADRESSE_URL_SEARCH+'?mc='+motCle+'&size='+size+'&page='+page);
  }
  getUserByUsername(username): Observable<any>{
    return this.http.get(API_URLS.USERNAME_URL+`/${username}`);
  }
}
