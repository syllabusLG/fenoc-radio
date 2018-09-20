import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {DashboardComponent} from './dashboard/dashboard.component';
import {LoginComponent} from './login/login.component';
import {HomeComponent} from './home/home.component';
import {UploadComponent} from './shared/crud/upload/upload.component';
import {UserComponent} from './user/user.component';
import {UserResolver} from './user/user.resolver';
import {FileComponent} from './file/file.component';


export const appRoutes: Routes = [

  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'home',
    component: HomeComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        outlet: 'contentOutlet'
      },
      {
        path: 'upload',
        component: UploadComponent,
        outlet: 'contentOutlet'
      },
      {
        path: 'file',
        component: FileComponent,
        outlet: 'contentOutlet'
      },
      {
        path: 'user',
        component: UserComponent,
        resolve: {
          users: UserResolver
        },
        outlet: 'contentOutlet'
      },
    ]
  },

  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  }
];
@NgModule({

  imports: [
    RouterModule.forRoot(
      appRoutes,
      {enableTracing: false}
    )
  ],
  exports: [RouterModule],
  providers: [UserResolver]
})
export class AppRoutingModule { }
