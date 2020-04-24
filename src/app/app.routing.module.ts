import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {DashboardComponent} from './dashboard/dashboard.component';
import {LoginComponent} from './login/login.component';
import {HomeComponent} from './home/home.component';
import {UserComponent} from './user/user.component';
import {UserResolver} from './user/user.resolver';
import {FileComponent} from './file/file.component';

import {HabilitationComponent} from "./habilitation/habilitation.component";
import {AuditComponent} from "./audit/audit.component";
import {AuditResolver} from "./audit/audit.resolver";
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
        path: 'dashboard',
        component: DashboardComponent,
        outlet: 'contentOutlet'
      },
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
        path: 'file',
        component: FileComponent,
        outlet: 'contentOutlet',
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: 'user',
        component: UserComponent,
        resolve: {
          users: UserResolver
        },
        outlet: 'contentOutlet'
      },

      {
        path: 'habilitation',
        component: HabilitationComponent,
        outlet: 'contentOutlet'
      },
      {
        path: 'audit',
        component: AuditComponent,
        resolve: {
          audits: AuditResolver
        },
        outlet: 'contentOutlet',
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
  providers: [UserResolver, AuditResolver, CanDeactivateGuard]
})
export class AppRoutingModule { }
