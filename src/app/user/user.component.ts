import { Component, OnInit } from '@angular/core';
import {User} from '../model/user.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from './user.service';
import {ActivatedRoute} from '@angular/router';
import {DataModel} from '../model/data.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  users: User[];

  user: User = new User();

  usersModel: DataModel[];

  userForm: FormGroup;

  constructor(public userService: UserService, private route: ActivatedRoute, private fb: FormBuilder) {
  }

  ngOnInit() {
    this.users = this.route.snapshot.data.users;

    this.userForm = this.fb.group({
      username: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required]
    });

    this.usersModel = [
      new DataModel('id','ID','number',true,[]),
      new DataModel('username','Nom d\'utilisateur','string',false,[]),
      new DataModel('firstName','Prenom','string',false,[]),
      new DataModel('lastName','Nom','string',false,[]),
      new DataModel('enable','Actif','number',true,[])
    ]

  }

}
