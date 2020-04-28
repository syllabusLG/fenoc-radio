import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {API_URLS} from "../config/api.url.config";

@Injectable({
  providedIn: 'root'
})
export class LimsService {
  constructor(private http: HttpClient) {}

  getLimsSamples(kit: string, study: string, sampleType: string, search:string): Observable<any>{
    return this.http.get(API_URLS.LIMS_SAMPLE_URL + '?kit='+kit+'&study='+study+'&sampleType='+sampleType+'&search='+search);
  }

  getLimsSampleDate(date: any, kit: string, study: string, sampleType: string, search:string): Observable<any>{
    return this.http.get(API_URLS.LIMS_SAMPLE_DATE_URL + '?date='+date+'&kit='+kit+'&study='+study+'&sampleType='+sampleType+'&search'+search)
  }
  getRedCapSamples(kitid: string, studyid: string, sampleType: string, search:string): Observable<any>{
    return this.http.get(API_URLS.REDCAP_SAMPLE_URL + '?kit='+kitid+'&study='+studyid+'&sampleType='+sampleType+'&search='+search)
  }
  getRedCapSampleDate(date: any, kitid: string, studyid: string, sampleType: string, search:string): Observable<any>{
    return this.http.get(API_URLS.REDCAP_SAMPLE_DATE_URL + '?date='+date+'&kit='+kitid+'&study='+studyid+'&sampleType='+sampleType+'&search='+search)
  }

}
