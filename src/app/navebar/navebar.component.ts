import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {AppService} from '../app.service';
import {AuditService} from '../audit/audit.service';
import {Audit} from '../shared/audit.model';
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-navebar',
  templateUrl: './navebar.component.html',
  styleUrls: ['./navebar.component.css']
})
export class NavebarComponent implements OnInit {

  @Input()
  showSideBar:boolean;
  @Output()
  showSideBarChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  audit: Audit = new Audit();
  constructor(private router: Router,
              private cookieService: CookieService,
              private auditService: AuditService,
              private appService: AppService) { }

  ngOnInit()
   {
  }


  afficherSideBar(){
    this.showSideBar = !this.showSideBar;
    this.showSideBarChange.emit(this.showSideBar);
  }
  logout(){
    this.appService.logout(()=>{
      this.router.navigateByUrl('/login');
      this.audit = this.appService.setAudit(this.audit);
      this.auditService.add(this.audit).subscribe();
      this.cookieService.deleteAll('http://localhost:4200');
    });
  }

}
