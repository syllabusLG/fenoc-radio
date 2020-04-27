import { Component, OnInit } from '@angular/core';
import {Store} from '@ngrx/store';
import {PrincipalState} from '../shared/principal.state';
import {Principal} from '../shared/principal.model';

@Component({
  selector: 'app-sidebare',
  templateUrl: './sidebare.component.html',
  styleUrls: ['./sidebare.component.css']
})
export class SidebareComponent implements OnInit {

  private principal: Principal;
  private isSIOpen: boolean = true
  private isAdminOpen: boolean = false;
  constructor(private store: Store<PrincipalState>) { }

  ngOnInit() {
    this.store.select('principal').subscribe(principal =>{
      this.principal = principal;
    })
  }

  isAdministrationOpen(){
    this.isAdminOpen = !this.isAdminOpen;
  }

  isSampleInventoryOpen(){
    this.isSIOpen = !this.isSIOpen;
  }

  hasRoleUser(){
    let hasRole: boolean = false;
    this.principal.authorities.forEach(item =>{
      if(item.authority === 'ROLE_USER'){
        hasRole = true;
      }
    });
    return hasRole;
  }

  hasRoleAdmin(){
    let hasRole: boolean = false;
    this.principal.authorities.forEach(item =>{
      if(item.authority === 'ROLE_ADMIN'){
        hasRole = true;
      }
    });
    return hasRole;
  }
  hasRoleIndividus(){
    let hasRole: boolean = false;
    this.principal.authorities.forEach(item =>{
      if(item.authority === 'ROLE_INDIVIDUS'){
        hasRole = true;
      }
    });
    return hasRole;
  }
  hasRoleSalarie(){
    let hasRole: boolean = false;
    this.principal.authorities.forEach(item =>{
      if(item.authority === 'ROLE_SALARIE'){
        hasRole = true;
      }
    });
    return hasRole;
  }
  hasRoleAdresse(){
    let hasRole: boolean = false;
    this.principal.authorities.forEach(item =>{
      if(item.authority === 'ROLE_ADRESSE'){
        hasRole = true;
      }
    });
    return hasRole;
  }
  hasRolePayment(){
    let hasRole: boolean = false;
    this.principal.authorities.forEach(item =>{
      if(item.authority === 'ROLE_PAYMENT'){
        hasRole = true;
      }
    });
    return hasRole;
  }
  hasRoleCompte(){
    let hasRole: boolean = false;
    this.principal.authorities.forEach(item =>{
      if(item.authority === 'ROLE_COMPTE'){
        hasRole = true;
      }
    });
    return hasRole;
  }
  hasRoleContact(){
    let hasRole: boolean = false;
    this.principal.authorities.forEach(item =>{
      if(item.authority === 'ROLE_CONTACT'){
        hasRole = true;
      }
    });
    return hasRole;
  }
  hasRoleDashboard(){
    let hasRole: boolean = false;
    this.principal.authorities.forEach(item =>{
      if(item.authority === 'ROLE_DASHBOARD'){
        hasRole = true;
      }
    });
    return hasRole;
  }

}
