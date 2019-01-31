import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {API_URLS} from './config/api.url.config';
import {CookieService} from 'ngx-cookie-service';
import {Store} from '@ngrx/store';
import {PrincipalState} from './shared/principal.state';
import {SAVE_PRINCIPAL} from './shared/save.principal.action';
import {AuditService} from './audit/audit.service';

@Injectable({
  providedIn: 'root',
})
export class AppService {

  authenticated: boolean = false;
  constructor(private http: HttpClient,
              private cookieService: CookieService,
              private auditService: AuditService,
              private store: Store<PrincipalState>) { }

  authenticate(credentials, callback){
    if(credentials){
      const token = btoa(credentials.username+ ':' + credentials.password);
      this.cookieService.set('token', token);
      this.cookieService.set('username', credentials.username);
      this.http.get(API_URLS.USER_URL).subscribe(response =>{
        if(response && response['name']){
          this.authenticated = true;
          this.store.dispatch({
            type: SAVE_PRINCIPAL,
            payload: response
          });
          this.cookieService.set('principal', JSON.stringify(response));
        }
        else{
          this.authenticated = false;
        }
        return callback && callback();
      });
    }else{
      this.authenticated = false;
    }
  }

  logout(callback){
    this.authenticated = false;
    //this.cookieService.deleteAll('/');
    return callback && callback();
  }

  setAudit(audit){
    audit.username = this.cookieService.get('username');
    audit.loginDate = this.cookieService.get('dateConnexion');
    audit.uploadFileName = this.cookieService.get('uploadFileName');
    audit.errorFileName = this.cookieService.get('fileUploadError');
    audit.reportFileName = this.cookieService.get('reportFileName');
    audit.individuReportCSV = this.cookieService.get('individuReportCSV');
    audit.salarieReportCSV = this.cookieService.get('salarieReportCSV');
    audit.contactReportCSV = this.cookieService.get('contactReportCSV');
    audit.paymentReportCSV = this.cookieService.get('paymentReportCSV');
    audit.adresseReportCSV = this.cookieService.get('adresseReportCSV');
    audit.compteReportCSV = this.cookieService.get('compteReportCSV');
    audit.updateIndividu = this.cookieService.get('updateIndividu');
    audit.updateSalarie = this.cookieService.get('updateSalarie');
    audit.updateContact= this.cookieService.get('updateContact');
    audit.updatePayment = this.cookieService.get('updatePayment');
    audit.updateAdresse = this.cookieService.get('updateAdresse');
    audit.updateCompte = this.cookieService.get('updateCompte');
    audit.deleteIndividu = this.cookieService.get('deleteIndividu');
    audit.deleteSalarie = this.cookieService.get('deleteSalarie');
    audit.deleteContact= this.cookieService.get('deleteContact');
    audit.deletePayment = this.cookieService.get('deletePayment');
    audit.deleteAdresse = this.cookieService.get('deleteAdresse');
    audit.deleteCompte = this.cookieService.get('deleteCompte');
    audit.habilitation = this.cookieService.get('habilitation');
    audit.createUser = this.cookieService.get('createUser');
    audit.updateUser = this.cookieService.get('updateUser');
    audit.deleteUser = this.cookieService.get('deleteUser');
    audit.changePassword = this.cookieService.get('changePassword');
    audit.updateMouvement = this.cookieService.get('updateMouvement');
    audit.deleteMouvement = this.cookieService.get('deleteMouvement');
    audit.updatePosition = this.cookieService.get('updatePosition');
    audit.deletePosition = this.cookieService.get('deletePosition');
    audit.uploadMovementFile = this.cookieService.get('uploadMovementFile');
    audit.uploadPositionFile = this.cookieService.get('uploadPositionFile');
    audit.exportMovementCSV = this.cookieService.get('exportMovementCSV');
    audit.exportPositionCSV = this.cookieService.get('exportPositionCSV');
    audit.operations = this.cookieService.get('operations');
    return audit;
  }
  loginDate(){
    let year =  new Date().getFullYear();
    let month = String(new Date().getMonth()+1);
    if (Number(month) >=1 && Number(month) <=9){
      month = '0'+month;
    }
    let day = String(new Date().getDate());
    if (Number(day) >=1 && Number(day) <= 9){
      day = '0'+day;
    }
    let hour = String(new Date().getHours());
    if (Number(hour) >=1 && Number(hour) <= 9){
      hour = '0'+hour;
    }
    let minute = String(new Date().getMinutes());
    if (Number(minute) >=0 && Number(minute) <= 9){
      minute = '0'+minute;
    }
    let seconde = String(new Date().getSeconds());
    if (Number(seconde) >=0 && Number(seconde) <= 9){
      seconde = '0'+seconde;
    }
    return day+'/'+month+'/'+year+' '+hour+':'+minute+':'+seconde;
  }
  saveAudit(audit){
    audit.dateAction = this.loginDate();
    audit.username = this.cookieService.get('username');
    this.auditService.add(audit).subscribe();
  }
}
