import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {API_URLS} from "../config/api.url.config";

@Injectable({
  providedIn: 'root'
})
export class LimsService {
  constructor(private http: HttpClient) {}

  getLimsSamples(kit: string, study: string, sampleType: string): Observable<any>{
    return this.http.get(API_URLS.LIMS_SAMPLE_URL + '?kit='+kit+'&study='+study+'&sampleType='+sampleType);
  }
  getRedCapSamples(kitid: string, studyid: string, sampleType: string): Observable<any>{
    return this.http.get(API_URLS.REDCAP_SAMPLE_URL + '?kit='+kitid+'&study='+studyid+'&sampleType='+sampleType)
  }

}
