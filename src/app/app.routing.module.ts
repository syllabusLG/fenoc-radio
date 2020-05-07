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
import {RadioHomeComponent} from "./radio-home/radio-home.component";
import {ProgramsComponent} from "./programs/programs.component";
import {PurLiveComponent} from "./pur-live/pur-live.component";
import {VideosComponent} from "./videos/videos.component";
import {PodcastComponent} from "./podcast/podcast.component";



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
        path: 'radio-home',
        component: RadioHomeComponent,
        outlet: 'contentOutlet',
      },
      {
        path: 'program',
        component: ProgramsComponent,
        outlet: 'contentOutlet',
      },
      {
        path: 'video',
        component: VideosComponent,
        outlet: 'contentOutlet',
      },
      {
        path: 'live',
        component: PurLiveComponent,
        outlet: 'contentOutlet',
      },
      {
        path: 'podcast',
        component: PodcastComponent,
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
