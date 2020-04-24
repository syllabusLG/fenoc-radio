import {Component, OnInit, ViewEncapsulation,} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AppService} from '../app.service';
import {Router} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  credentials =  {
    username: '',
    password: ''
  };
  constructor( private fb: FormBuilder,
               private cookieService: CookieService,
               private appservice: AppService,
               private router: Router) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(16)])]
    });
  }
  login(){
    this.appservice.authenticate(this.credentials, ()=>{
      this.router.navigateByUrl('home/(contentOutlet:lims)');
      this.cookieService.set('dateConnexion' , this.loginDate());
      //this.cookieService.set('username', this.credentials.username);
    })
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
}
