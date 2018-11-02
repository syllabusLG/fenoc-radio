import { Component, OnInit } from '@angular/core';
import {User} from '../shared/user.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from './user.service';
import {ActivatedRoute} from '@angular/router';
import {DataModel} from '../shared/data.model';

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

  constructor(private userService: UserService, private route: ActivatedRoute, private fb: FormBuilder) {
  }

  ngOnInit() {
    this.users = this.route.snapshot.data.users;

    this.userForm = this.fb.group({
      username: ['', Validators.required],
    });

    this.usersModel = [
      new DataModel('id','ID','number',true,[]),
      new DataModel('username','Nom d\'utilisateur','string',false,[]),
     // new DataModel('firstName','Prenom','string',false,[]),
      //new DataModel('username','Nom','string',false,[]),
      new DataModel('enable','Actif','number',true,[])
    ]

  }

}
