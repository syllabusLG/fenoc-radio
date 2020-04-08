import {Component, Injectable, OnInit, Output} from '@angular/core';
import {TreeviewConfig, TreeviewItem} from "ngx-treeview";
import {UserService} from "../user/user.service";
import {User} from "../shared/user.model";
import {Role} from "../shared/role.model";
import {Principal} from "../shared/principal.model";
import {Store} from "@ngrx/store";
import {PrincipalState} from "../shared/principal.state";
import {CookieService} from 'ngx-cookie-service';
import {AppService} from '../app.service';
import {Audit} from '../shared/audit.model';

@Component({
  selector: 'app-habilitation',
  templateUrl: './habilitation.component.html',
  styleUrls: ['./habilitation.component.css']
})

@Injectable()

export class HabilitationComponent implements OnInit {

  items: TreeviewItem[];
  values: number[];
  config = TreeviewConfig.create({
    hasAllCheckBox: true,
    hasFilter: true,
    hasCollapseExpand: true,
    decoupleChildFromParent: false,
    maxHeight: 400
  });

  user:User = new User();
  private allRoles: Role[] = [
    new Role(1, "ROLE_USER"),
    new Role(2, "ROLE_ADMIN"),
    new Role(3, "ROLE_INDIVIDUS"),
    new Role(4, "ROLE_SALARIE"),
    new Role(5, "ROLE_ADRESSE"),
    new Role(6, "ROLE_PAYMENT"),
    new Role(8, "ROLE_COMPTE"),
    new Role(9, "ROLE_CONTACT"),
    new Role(7, "ROLE_DASHBOARD"),
    new Role (10,"ROLE_AUDIT")
  ];
  private principal: Principal;
  constructor(private userService: UserService,
              private cookieService: CookieService,
              private appService: AppService,
              private store: Store<PrincipalState>) {
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.userService.getAll().subscribe(listUsers => {
      this.items = this.getUsers(listUsers);},
      error => {console.log(error);}
    );
  }

  onFilterChange(value: string) {
    console.log('filter:', value);
  }

  UpdateRoles(event?:any) {
    let roles: string= '';
    for (let tree of this.items) {
      let userRoles:Role[] = [];
      let userId = tree.value;
      this.userService.getOne(userId).subscribe(data => {
        this.user = data;
        for (let roleNode of tree.children) {
          if (roleNode.checked) {
            userRoles.push(new Role(roleNode.value, roleNode.text))
            roles=roles+' '+roleNode.text;
          }
        }

        this.user.roles = userRoles;
        this.userService.update(this.user).subscribe(data => {
          let audit: Audit = new Audit();
          this.cookieService.set('habilitation', this.cookieService.get('habilitation')+';'+this.user.firstName+' '+this.user.lastName+' {'+roles+'}');
          audit.habilitation = this.user.firstName+' '+this.user.lastName+' {'+roles+'}';
          this.appService.saveAudit(audit);
        });

      });
    }
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

  getUsers(users: User[]): TreeviewItem[] {
    this.store.select('principal').subscribe(principal =>{
      this.principal = principal;
    });

    let children: TreeviewItem[] = [];
    for(let user of users) {
      if(this.hasRoleAdmin() && user.username !='admin') {
        children.push(
          new TreeviewItem({
            text: user.username,
            value: user.id,
            children: this.extractRoles(this.allRoles, user.roles)
          })
        );
      }
    }
    return children;
  }

  private extractRoles(allRoles: Role[], userRoles: Role[]): TreeviewItem[] {
    let result: TreeviewItem[] = [];
    allRoles.forEach(role => {
      result.push(new TreeviewItem({
        text: role.name,
        value: role.id,
        checked: userRoles.some(userRole => userRole.id == role.id)
      }));
    });

    return result;
  }
}
