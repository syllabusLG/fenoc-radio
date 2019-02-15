import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularDraggableModule  } from 'angular2-draggable';

import { AppComponent } from './app.component';
import { SidebareComponent } from './sidebare/sidebare.component';
import { NavebarComponent } from './navebar/navebar.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ContentComponent } from './content/content.component';
import {AppRoutingModule} from './app.routing.module';
import { HomeComponent } from './home/home.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { UploadComponent } from './shared/crud/upload/upload.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {XhrInterceptor} from './xhr.interceptor';
import {CookieService} from 'ngx-cookie-service';
import { UserComponent } from './user/user.component';
import {StoreModule} from '@ngrx/store';
import {principalReducer} from './shared/principal.reducer';
import { CrudComponent } from './shared/crud/crud.component';
import { SampleComponent } from './shared/crud/sample/sample.component';
import { FileComponent } from './file/file.component';
import { IndividusComponent } from './individus/individus.component';
import { SalarieComponent } from './salarie/salarie.component';
import { ContactComponent } from './contact/contact.component';
import { PaymentComponent } from './payment/payment.component';
import { AdresseComponent } from './adresse/adresse.component';
import { CompteComponent } from './compte/compte.component';
import { FiscaliteComponent } from './fiscalite/fiscalite.component';
import {TranslatePipe} from "./common/pipes/translate.pipe";
import { ReportCreateFileComponent } from './report-create-file/report-create-file.component';
import { ReportUpdateFileComponent } from './report-update-file/report-update-file.component';
import { MyChartComponent } from './my-chart/my-chart.component';
import {ChartModule} from 'angular2-chartjs';
import {HabilitationComponent} from "./habilitation/habilitation.component";
import { TreeviewModule } from 'ngx-treeview';
import {AuditComponent} from "./audit/audit.component";
import {MomentModule} from "angular2-moment";
import {NgIdleKeepaliveModule} from "@ng-idle/keepalive";
import {MovementComponent} from "./movement/movement.component";
import {PositionComponent} from "./position/position.component";
import { OperationsComponent } from './operations/operations.component';
import { SearchInputComponent } from './search-input/search-input.component';


@NgModule({
  declarations: [
    AppComponent,
    SidebareComponent,
    NavebarComponent,
    LoginComponent,
    DashboardComponent,
    ContentComponent,
    HomeComponent,
    UploadComponent,
    UserComponent,
    CrudComponent,
    SampleComponent,
    FileComponent,
    IndividusComponent,
    SalarieComponent,
    ContactComponent,
    PaymentComponent,
    AdresseComponent,
    CompteComponent,
    FiscaliteComponent,
    TranslatePipe,
    ReportCreateFileComponent,
    ReportUpdateFileComponent,
    MyChartComponent,
    HabilitationComponent,
    AuditComponent,
    MovementComponent,
    PositionComponent,
    OperationsComponent,
    SearchInputComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    StoreModule.forRoot({principal: principalReducer}),
    AngularDraggableModule,
    ChartModule,
    TreeviewModule.forRoot(),
    MomentModule,
    NgIdleKeepaliveModule.forRoot()
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: XhrInterceptor, multi: true},
    CookieService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
