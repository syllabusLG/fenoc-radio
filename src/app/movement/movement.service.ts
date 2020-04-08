import {Injectable} from '@angular/core';
import {API_URLS} from '../config/api.url.config';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MovementService {

  constructor(private http: HttpClient){}

  getAll(): Observable<any>{
    return this.http.get(API_URLS.MOVEMENT_URL);
  }

  add(movement): Observable<any>{
    return this.http.post(API_URLS.MOVEMENT_URL, movement);
  }

  update(movement): Observable<any>{
    return this.http.put(API_URLS.MOVEMENT_URL, movement);
  }

  delete(id): Observable<any>{
    return this.http.delete(API_URLS.MOVEMENT_URL +`/${id}`);
  }

  addAll(list): Observable<any>{
    return this.http.post(API_URLS.MOVEMENT_URL + '/all', list);
  }

  getOne(id): Observable<any>{
    return this.http.get(API_URLS.MOVEMENT_URL +`/${id}`);
  }
  search(motCle:string, page:number, size:number): Observable<any>{
    return this.http.get(API_URLS.MOVEMENT_URL_SEARCH +'?mc='+motCle+'&size='+size+'&page='+page);
  }
  movementsByDate(numCompte: string, dateBefore: any, dateAfter: any, page:number, size:number, filter: string): Observable<any>{
    return this.http.get(API_URLS.MOVEMENT_URL_DATE+'?numCompte='+numCompte+'&dateBefore='+dateBefore+'&dateAfter='+dateAfter+'&size='+size+'&page='+page+'&filter='+filter);
  }
}
