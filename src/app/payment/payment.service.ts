import {Injectable} from '@angular/core';
import {CrudService} from '../shared/crud.service';
import {API_URLS} from '../config/api.url.config';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PaymentService implements CrudService{

  constructor(private http: HttpClient){}

  getAll(): Observable<any>{
    return this.http.get(API_URLS.PAYMENT_URL);
  }

  add(bic): Observable<any>{
    return this.http.post(API_URLS.PAYMENT_URL, bic);
  }

  update(bic): Observable<any>{
    return this.http.put(API_URLS.PAYMENT_URL, bic);
  }

  delete(bic): Observable<any>{
    return this.http.delete(API_URLS.PAYMENT_URL +`/${bic}`);
  }

  addAll(list): Observable<any>{
    return this.http.post(API_URLS.PAYMENT_URL + '/all', list);
  }

  getOne(id): Observable<any>{
    return this.http.get(API_URLS.PAYMENT_URL +`/${id}`);
  }
  search(motCle:string, page:number, size:number): Observable<any>{
    return this.http.get(API_URLS.PAYMENT_URL_SEARCH +'?mc='+motCle+'&size='+size+'&page='+page);
  }
}
