import {Injectable} from '@angular/core';
import {CrudService} from '../shared/crud.service';
import {HttpClient} from '@angular/common/http';
import {API_URLS} from '../config/api.url.config';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuditService implements CrudService{

  constructor(private http: HttpClient){}

  getAll(): Observable<any>{
    return this.http.get(API_URLS.AUDIT_URL);
  }

  add(audit): Observable<any>{
    return this.http.post(API_URLS.AUDIT_URL, audit);
  }
  update(audit): Observable<any>{
    return this.http.put(API_URLS.AUDIT_URL, audit);
  }
  delete(id): Observable<any>{
    return this.http.delete(API_URLS.AUDIT_URL +`/${id}`);
  }

  addAll(list): Observable<any>{
    return this.http.post(API_URLS.AUDIT_URL + '/all', list);
  }

  getOne(id): Observable<any>{
    return this.http.get(API_URLS.AUDIT_URL +`/${id}`);
  }

  search(motCle:string, page:number, size:number): Observable<any>{
    return this.http.get(API_URLS.AUDIT_URL_SEARCH+'?mc='+motCle+'&size='+size+'&page='+page);
  }

  auditsByDate(dateBefore: any, dateAfter: any, page:number, size:number): Observable<any>{
    return this.http.get(API_URLS.AUDIT_URL_DATE+'?dateBefore='+dateBefore+'&dateAfter='+dateAfter+'&size='+size+'&page='+page);
  }

}
