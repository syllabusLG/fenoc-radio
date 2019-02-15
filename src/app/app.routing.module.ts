import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {DashboardComponent} from './dashboard/dashboard.component';
import {LoginComponent} from './login/login.component';
import {HomeComponent} from './home/home.component';
import {UploadComponent} from './shared/crud/upload/upload.component';
import {UserComponent} from './user/user.component';
import {UserResolver} from './user/user.resolver';
import {FileComponent} from './file/file.component';
import {AdresseComponent} from './adresse/adresse.component';
import {AdresseResolver} from './adresse/adresse.resolver';
import {SalarieComponent} from './salarie/salarie.component';
import {SalarieResolver} from './salarie/salarie.resolver';
import {PaymentComponent} from "./payment/payment.component";
import {CompteComponent} from "./compte/compte.component";
import {ContactComponent} from "./contact/contact.component";
import {IndividusComponent} from "./individus/individus.component";
import {PaymentResolver} from "./payment/payment.resolver";
import {CompteResolver} from "./compte/compte.resolver";
import {ContactResolver} from "./contact/contact.resolver";
import {IndividusResolver} from "./individus/individus.resolver";
import {HabilitationComponent} from "./habilitation/habilitation.component";
import {AuditComponent} from "./audit/audit.component";
import {AuditResolver} from "./audit/audit.resolver";
import {MovementComponent} from "./movement/movement.component";
import {PositionComponent} from "./position/position.component";
import {MovementResolver} from "./movement/movement.resolver";
import {PositionResolver} from './position/position.resolver';
import {OperationsComponent} from './operations/operations.component';
import {InstrumentsComponent} from './instruments/instruments.component';
import {InstrumentResolver} from './instruments/instrument.resolver';



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
      {
        path: 'adresse',
        component: AdresseComponent,
        resolve: {
          adresses: AdresseResolver
        },
        outlet: 'contentOutlet'
      },
      {
        path: 'salarie',
        component: SalarieComponent,
        resolve: {
          salaries: SalarieResolver
        },
        outlet: 'contentOutlet'
      },
      {
        path: 'payment',
        component: PaymentComponent,
        resolve: {
          payments: PaymentResolver
        },
        outlet: 'contentOutlet'
      },
      {
        path: 'compte',
        component: CompteComponent,
        resolve: {
          comptes: CompteResolver
        },
        outlet: 'contentOutlet'
      },
      {
        path: 'individu',
        component: IndividusComponent,
        resolve: {
          individus: IndividusResolver
        },
        outlet: 'contentOutlet'
      },
      {
        path: 'contact',
        component: ContactComponent,
        resolve: {
          contacts: ContactResolver
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
      {
        path: 'instrument',
        component: InstrumentsComponent,
        resolve: {
          instruments: InstrumentResolver
        },
        outlet: 'contentOutlet',
      },
      {
        path: 'movement',
        component: MovementComponent,
        resolve: {
          movements: MovementResolver
        },
        outlet: 'contentOutlet',
      },
      {
        path: 'position',
        component: PositionComponent,
        resolve: {
          positions: PositionResolver
        },
        outlet: 'contentOutlet',
      },
      {
        path: 'operations',
        component: OperationsComponent,
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
  providers: [UserResolver, AdresseResolver, SalarieResolver, PaymentResolver, CompteResolver,ContactResolver,IndividusResolver, AuditResolver, MovementResolver, PositionResolver, InstrumentResolver]
})
export class AppRoutingModule { }
