import {Component, OnInit} from '@angular/core';
import {AppService} from './app.service';
import {NavigationEnd, Router} from '@angular/router';
import * as moment from 'moment';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  private isLogin = false;

  constructor(private appService: AppService,
              private router: Router){

    this.router.events.subscribe(
      ( event) : void => {
        if ( event instanceof NavigationEnd ) {
          this.isLogin = this.router.isActive( "/login", true );
        }
      }
    );

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
