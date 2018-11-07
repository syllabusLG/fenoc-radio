import {Component, OnInit} from '@angular/core';
import {AppService} from './app.service';
import {NavigationEnd, Router} from '@angular/router';
import {DEFAULT_INTERRUPTSOURCES, Idle} from "@ng-idle/core";
import {Keepalive} from "@ng-idle/keepalive";
import {CookieService} from 'ngx-cookie-service';
import {Audit} from './shared/audit.model';
import {AuditService} from './audit/audit.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  private isLogin = false;
  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = null;
  audit: Audit = new Audit();

  constructor(private appService: AppService,
              private cookieService: CookieService,
              private auditService: AuditService,
              private router: Router,
              private idle: Idle,
              private keepalive: Keepalive){

    this.router.events.subscribe(
      ( event) : void => {
        if ( event instanceof NavigationEnd ) {
          this.isLogin = this.router.isActive( "/login", true );
        }
      }
    );
    // sets an idle timeout of 5 seconds, for testing purposes.
    idle.setIdle(5);
    // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
    idle.setTimeout(5);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onIdleEnd.subscribe(() => this.idleState = 'No longer idle.');
    idle.onTimeout.subscribe(() => {
      this.idleState = 'Timed out!';
      this.timedOut = true;
      this.changeToLoginPage();
    });
    idle.onIdleStart.subscribe(() => this.idleState = 'You\'ve gone idle!');
    idle.onTimeoutWarning.subscribe((countdown) => this.idleState = 'You will time out in ' + countdown + ' seconds!');

    // sets the ping interval to 15 seconds
    keepalive.interval(15);

    keepalive.onPing.subscribe(() => this.lastPing = new Date());
    this.reset();
  }
  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }

  changeToLoginPage()
  {
    this.audit = this.setAudit(this.audit);
    this.auditService.add(this.audit).subscribe();
    this.cookieService.deleteAll('http://localhost:4200');
    return this.router.navigateByUrl('/login');

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
    return audit;
  }

  ngOnInit(){
    if(!this.appService.authenticated){
      this.router.navigateByUrl('/login');
      this.isLogin = true;
    }else{
      this.router.navigateByUrl('home/(contentOutlet:file)');
    }
  }
}
