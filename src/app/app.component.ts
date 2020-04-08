import {Component, HostListener, Input, OnInit} from '@angular/core';
import {AppService} from './app.service';
import {NavigationEnd,Router} from '@angular/router';
import {DEFAULT_INTERRUPTSOURCES, Idle} from "@ng-idle/core";
import {CookieService} from 'ngx-cookie-service';
import {Audit} from './shared/audit.model';
import {AuditService} from './audit/audit.service';
import {SAVE_PRINCIPAL} from "./shared/save.principal.action";
import {Store} from "@ngrx/store";
import {PrincipalState} from "./shared/principal.state";
import {Keepalive} from '@ng-idle/keepalive';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  public isLogin = false;
  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = null;
  audit: Audit = new Audit();

  @HostListener('window:unload', ['$event'])
  unloadHandler(event) {
    this.audit = this.appService.setAudit(this.audit);
    this.auditService.add(this.audit).subscribe();
    // this.cookieService.deleteAll('http://localhost:4200');
  }

  constructor(private appService: AppService,
              private cookieService: CookieService,
              private auditService: AuditService,
              private router: Router,
              private idle: Idle,
              private keepalive: Keepalive,
              private store: Store<PrincipalState>){

    this.router.events.subscribe(
      ( event) : void => {
        if ( event instanceof NavigationEnd ) {
          this.isLogin = this.router.isActive( "/login", true );
        }
      }
    );
    // sets an idle timeout of 5 seconds, for testing purposes.
    idle.setIdle(500);
    // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
    idle.setTimeout(500);
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

  changeToLoginPage()  {
    this.audit = this.appService.setAudit(this.audit);
    this.auditService.add(this.audit).subscribe();
    this.cookieService.deleteAll('/');
    return this.router.navigateByUrl('/login');

  }

  ngOnInit() {

      if (!this.cookieService.get('principal')) {
        this.router.navigateByUrl('/login');
        this.isLogin = true;
      } else {
        let principal = JSON.parse(this.cookieService.get('principal'));
        this.store.dispatch({
          type: SAVE_PRINCIPAL,
          payload: principal
        });
        this.router.navigateByUrl('home/(contentOutlet:file)');
      }
    }
}
