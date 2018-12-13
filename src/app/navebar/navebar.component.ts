import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Router} from '@angular/router';
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

  @Input()
  pleaseChangePass: boolean = false;
  compteSessionActive: boolean=false;

  constructor(private router: Router,
              private cookieService: CookieService,
              private auditService: AuditService,
              private appService: AppService,
              private fb: FormBuilder,
              private userservice: UserService) {

    this.createForm();
    this.router.events.subscribe(
      ( event) : void => {
        this.compteSessionActive = ((this.router.url === "/home/(contentOutlet:compte)")|| (this.router.url === "/home/(contentOutlet:movement)") ||
          (this.router.url === "/home/(contentOutlet:position)")) ? true : false;
      }
    );
  }

  ngOnInit() {
    this.username = this.cookieService.get('username');
    this.userservice.getUserByUsername(this.username).subscribe(
      data=>{
        this.user=data;
        this.pleaseChangePass = this.user.changePassword=="FALSE" ? true : false;
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
      this.cookieService.deleteAll('/');
    });
  }

  updateUserPassword(){
    this.user.password=this.currentpassword;
    this.user.changePassword='TRUE';
    this.pleaseChangePass = false;
    this.userservice.update(this.user).subscribe();
    this.router.navigateByUrl('/login');
  }

}
