import {CrudService} from '../shared/crud.service';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {API_URLS} from '../config/api.url.config';

@Injectable({
  providedIn: 'root'
})
export class InstrumentService implements CrudService{

  constructor(private http: HttpClient){}

  getAll(): Observable<any>{
    return this.http.get(API_URLS.INSTRUMENT_URL);
  }

  add(instrument): Observable<any>{
    return this.http.post(API_URLS.INSTRUMENT_URL, instrument);
  }

  update(instrument): Observable<any>{
    return this.http.put(API_URLS.INSTRUMENT_URL, instrument);
  }

  delete(id): Observable<any>{
    return this.http.delete(API_URLS.INSTRUMENT_URL +`/${id}`);
  }

  addAll(list): Observable<any>{
    return this.http.post(API_URLS.INSTRUMENT_URL + '/all', list);
  }

  getOne(id): Observable<any>{
    return this.http.get(API_URLS.INSTRUMENT_URL +`/${id}`);
  }
  search(motCle:string, page:number, size:number): Observable<any>{
    return this.http.get(API_URLS.INSTRUMENT_URL_SEARCH +'?mc='+motCle+'&size='+size+'&page='+page);
  }

}
