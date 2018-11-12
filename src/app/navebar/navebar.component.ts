import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {AppService} from '../app.service';
import {AuditService} from '../audit/audit.service';
import {Audit} from '../shared/audit.model';
import {CookieService} from 'ngx-cookie-service';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {User} from "../shared/user.model";
import {UserService} from "../user/user.service";
import {matchOtherValidator} from "./password.validator";

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
  user: User = new User();
  oldpassword: string;
  currentpassword: string;
  confirmationnewpassword: string;


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
    this.userservice.getUserByUsername(this.username).subscribe(
      data=>{
        this.user=data;
        this.user.oldPassword = this.user.password;
      }, error => {
        console.log(error);
      });
  }

  createForm() {
    this.userForm = this.fb.group({
      oldPassword: ['', Validators.min(5)],
      currentPassword:['', Validators.required],
      confirmationnewpassword: ['', [Validators.required, matchOtherValidator('currentPassword')]],
      });

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
  updateUserPassword(){
    this.user.password=this.currentpassword;
    this.userservice.update(this.user).subscribe();
    this.cookieService.set('password',this.user.password);
  }


}
