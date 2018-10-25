import {CrudService} from '../shared/crud.service';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {API_URLS} from '../config/api.url.config';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class SalarieService implements CrudService{

  constructor(private http: HttpClient){}

  getAll(): Observable<any>{
    return this.http.get(API_URLS.SALARIE_URL);
  }

  add(salarie): Observable<any>{
    return this.http.post(API_URLS.SALARIE_URL, salarie);
  }
  update(salarie): Observable<any>{

    console.log(new Date(Date.parse(salarie.hireDate)));
    if(salarie.hireDate!=null|| salarie.departDate!=null ) {
      salarie.hireDate = this.convertDate(salarie.hireDate);
    }


    return this.http.put(API_URLS.SALARIE_URL, salarie);
  }
  delete(id): Observable<any>{
    return this.http.delete(API_URLS.SALARIE_URL +`/${id}`);
  }

  addAll(list): Observable<any>{
    return this.http.post(API_URLS.SALARIE_URL + '/all', list);
  }

  getOne(id): Observable<any>{
    return this.http.get(API_URLS.SALARIE_URL +`/${id}`);
  }

  search(motCle:string, page:number, size:number): Observable<any>{
    return this.http.get(API_URLS.SALARIE_URL_SEARCH+'?mc='+motCle+'&size='+size+'&page='+page);
  }

  private convertDate(datest: any) {
    datest.parse('dd mm YYYY');
    let dateData = datest.split('-');
    let year = dateData [0];
    let month = dateData [1];
    let day = dateData [2];
    let dateFormated = day + "/" + month + "/" + year;
    return dateFormated;


  }

}
