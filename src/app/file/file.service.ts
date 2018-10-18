import {CrudService} from '../shared/crud.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {API_URLS} from '../config/api.url.config';
import {Injectable} from '@angular/core';

@Injectable()
export class FileService implements CrudService{
  constructor(private http: HttpClient){}
  getAll(): Observable<any>{
    return this.http.get(API_URLS.PAYS_URL);
  }
 /* getAllPays(): Observable<any>{
    return this.http.get(API_URLS.PAYS_URL);
  }*/

  add(pays): Observable<any>{
    return this.http.post(API_URLS.PAYS_URL, pays);
  }
  update(pays): Observable<any>{
    return this.http.put(API_URLS.PAYS_URL, pays);
  }
  delete(id): Observable<any>{
    return this.http.delete(API_URLS.PAYS_URL +`/${id}`);
  }

  addAll(list): Observable<any>{
    return this.http.post(API_URLS.FILE_URL + '/all', list);
  }

  getOne(id): Observable<any>{
    return this.http.get(API_URLS.FILE_URL +`/${id}`);
  }

}
