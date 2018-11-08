import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {AppService} from '../app.service';
import {AuditService} from '../audit/audit.service';
import {Audit} from '../shared/audit.model';
import {CookieService} from 'ngx-cookie-service';
import {Salarie} from "../shared/salarie.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {User} from "../shared/user.model";
import {UserService} from "../user/user.service";

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

  @Input()
   username: string;
  audit: Audit = new Audit();

  userForm: FormGroup;
  user: User;

  constructor(private router: Router,
              private cookieService: CookieService,
              private auditService: AuditService,
              private appService: AppService,
              private fb: FormBuilder,
              private userservice: UserService
              ) {
    this.createForm();
  }

  ngOnInit() {
    this.username = this.cookieService.get('username');
    //console.log(this.cookieService.)
  }

  createForm() {
    this.userForm = this.fb.group({
      user_id: '',
      password: ''
    });
  }

  afficherSideBar(){
    this.showSideBar = !this.showSideBar;
    this.showSideBarChange.emit(this.showSideBar);
  }
  logout(){
    this.appService.logout(()=>{
      this.router.navigateByUrl('/login');
      this.audit = this.setAudit(this.audit);
      this.auditService.add(this.audit).subscribe();
      this.cookieService.deleteAll('http://localhost:4200');
    });
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
}
