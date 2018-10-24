import {CrudService} from '../shared/crud.service';
import {API_URLS} from '../config/api.url.config';
import {Observable} from 'rxjs/Observable';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable()
export class ReportCreateFileService implements CrudService{

  constructor(private http: HttpClient){}

  getAll(): Observable<any>{
    return this.http.get(API_URLS.REPORT_CREATE_URL);
  }

  add(entity): Observable<any> {
    return this.http.post(API_URLS.REPORT_CREATE_URL, entity);
  }

  update(entity): Observable<any> {
    return this.http.put(API_URLS.REPORT_CREATE_URL, entity);
  }

  delete(id): Observable<any> {
    return this.http.delete(API_URLS.REPORT_CREATE_URL + `/${id}`);
  }

  addAll(list): Observable<any>{
    return this.http.post(API_URLS.REPORT_CREATE_URL + '/all', list);
  }

  getOne(id): Observable<any>{
    return this.http.get(API_URLS.REPORT_CREATE_URL +`/${id}`);
  }
  search(motCle:string, page:number, size:number): Observable<any>{
    return this.http.get(API_URLS.REPORT_CREATE_URL+'?mc='+motCle+'&size='+size+'&page='+page);
  }
}
