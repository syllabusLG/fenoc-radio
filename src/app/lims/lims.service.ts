import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {API_URLS} from "../config/api.url.config";

@Injectable({
  providedIn: 'root'
})
export class LimsService {
  constructor(private http: HttpClient) {}

  getSAmples(kit: string, study: string): Observable<any>{
    return this.http.get(API_URLS.LIMS_SAMPLE_URL + '?kit='+kit+'&study='+study);
  }
  getRedCapSamples(kitid: string, studyid: string): Observable<any>{
    return this.http.get(API_URLS.REDCAP_SAMPLE_URL + '?kit='+kitid+'&study='+studyid)
  }

}
