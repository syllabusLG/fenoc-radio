import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {HomeComponent} from './home/home.component';
import {UserComponent} from './user/user.component';
import {UserResolver} from './user/user.resolver';
import { CanDeactivateGuard } from './shared/crud/upload/can-deactivate-guard.service';
import {CheckComponent} from "./check/check.component";
import {LimsComponent} from "./lims/lims.component";
import {UploadComponent} from "./shared/crud/upload/upload.component";



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
        path: 'check',
        component: CheckComponent,
        outlet: 'contentOutlet',
      },
      {
        path: 'lims',
        component: LimsComponent,
        outlet: 'contentOutlet',
      },
      {
        path: 'upload',
        component: UploadComponent,
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
  providers: [UserResolver, CanDeactivateGuard]
})
export class AppRoutingModule { }
