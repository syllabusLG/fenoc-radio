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
import {AppService} from './app.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { UploadComponent } from './shared/crud/upload/upload.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {XhrInterceptor} from './xhr.interceptor';
import {CookieService} from 'ngx-cookie-service';
import { UserComponent } from './user/user.component';
import {StoreModule} from '@ngrx/store';
import {principalReducer} from './shared/principal.reducer';
import {UserService} from './user/user.service';
import { CrudComponent } from './shared/crud/crud.component';
import { SampleComponent } from './shared/crud/sample/sample.component';
import { FileComponent } from './file/file.component';
import {FileService} from './file/file.service';
import { IndividusComponent } from './individus/individus.component';
import {IndividusService} from './individus/individus.service';
import { SalarieComponent } from './salarie/salarie.component';
import {SalarieService} from './salarie/salarie.service';
import { ContactComponent } from './contact/contact.component';
import {ContactService} from './contact/contact.service';
import { PaymentComponent } from './payment/payment.component';
import {PaymentService} from './payment/payment.service';
import { AdresseComponent } from './adresse/adresse.component';
import {AdresseService} from './adresse/adresse.service';
import { CompteComponent } from './compte/compte.component';
import {CompteService} from './compte/compte.service';
import { FiscaliteComponent } from './fiscalite/fiscalite.component';
import {FiscaliteService} from './fiscalite/fiscalite.service';
import {TranslatePipe} from "./common/pipes/translate.pipe";
import { ReportCreateFileComponent } from './report-create-file/report-create-file.component';
import { ReportUpdateFileComponent } from './report-update-file/report-update-file.component';
import {ReportCreateFileService} from './report-create-file/report.create.file.service';
import {ReportUpdateFileService} from './report-update-file/report.update.file.service';
import { MyChartComponent } from './my-chart/my-chart.component';
import {ChartModule} from 'angular2-chartjs';
import {HabilitationComponent} from "./habilitation/habilitation.component";


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
    HabilitationComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    StoreModule.forRoot({principal: principalReducer}),
    AngularDraggableModule,
    ChartModule
  ],
  providers: [
    AppService,
    {provide: HTTP_INTERCEPTORS, useClass: XhrInterceptor, multi: true},
    CookieService,
    UserService,
    FileService,
    IndividusService,
    SalarieService,
    ContactService,
    PaymentService,
    AdresseService,
    CompteService,
    FiscaliteService,
    ReportCreateFileService,
    ReportUpdateFileService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
