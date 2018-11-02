import {Component, OnInit, Output} from '@angular/core';
import {TreeviewConfig, TreeviewItem} from "ngx-treeview";
import {HabilitationService} from "./habilitation.service";
import {UserService} from "../user/user.service";
import {User} from "../shared/user.model";
import {Role} from "../shared/role.model";
import {ActivatedRoute} from "@angular/router";
import {forEach} from "@angular/router/src/utils/collection";

@Component({
  selector: 'app-habilitation',
  templateUrl: './habilitation.component.html',
  styleUrls: ['./habilitation.component.css']
})

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

  constructor(private habilitationservice: HabilitationService, private userService: UserService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.userService.getAll().subscribe(listUsers => {
      this.items = this.habilitationservice.getUsers(listUsers);
    });
  }

  onFilterChange(value: string) {
    console.log('filter:', value);
  }

  UpdateRoles() {
    for (let tree of this.items) {
      let userRoles: Role[] = [];
      let userId = tree.value;
      this.userService.getOne(userId).subscribe(data => {
        this.user = data;
        for (let roleNode of tree.children) {
          if (roleNode.checked) {
            //userRoles.push(new Role(roleNode.value, roleNode.text));
            this.user.roles.push(new Role(roleNode.value, roleNode.text))
          }
        }
        this.userService.update(this.user).subscribe();
      });


    }
  }
}
