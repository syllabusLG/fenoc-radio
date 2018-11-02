import {Injectable, Input} from '@angular/core';
import {TreeviewItem} from "ngx-treeview";
import {UserService} from "../user/user.service";
import {User} from "../shared/user.model";
import {Role} from "../shared/role.model";


@Injectable()
export class HabilitationService {

  //@Input()
  allrolesdb : Role[] = [];
  private allRoles: Role[] = [
    new Role(1, "ROLE_USER"),
    new Role(2, "ROLE_ADMIN"),
    new Role(3, "ROLE_INDIVIDUS"),
    new Role(4, "ROLE_SALARIE"),
    new Role(5, "ROLE_ADRESSE"),
    new Role(6, "ROLE_PAYMENT"),
    new Role(8, "ROLE_COMPTE"),
    new Role(9, "ROLE_CONTACT"),
    new Role(7, "ROLE_DASHBOARD")
  ];

  constructor(private userService: UserService){}

  getAllRolesAvailable(){
    this.userService.getAllRoles().subscribe(
      roles => {this.allrolesdb=roles});
  }

  getUsers(users: User[]): TreeviewItem[] {

    let children: TreeviewItem[] = [];

    for(let user of users) {
      children.push(
        new TreeviewItem({
          text: user.username,
          value: user.id,
          children: this.extractRoles(this.allRoles, user.roles)
        })
      );
    }

    return children;

  }

  private extractRoles(allRoles: Role[], userRoles: Role[]): TreeviewItem[] {
    let result: TreeviewItem[] = [];
    //console.log("get all roles"+this.getAllRolesAvailable());
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
