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
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {XhrInterceptor} from './xhr.interceptor';
import {CookieService} from 'ngx-cookie-service';
import { UserComponent } from './user/user.component';
import {StoreModule} from '@ngrx/store';
import {principalReducer} from './shared/principal.reducer';
import { CrudComponent } from './shared/crud/crud.component';
import { SampleComponent } from './shared/crud/sample/sample.component';
import { FileComponent } from './file/file.component';
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
import { SearchInputComponent } from './shared/search-input/search-input.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CanDeactivateGuard } from './shared/crud/upload/can-deactivate-guard.service';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from './common/confirm-modal/confirm-modal.component';
import { CheckComponent } from './check/check.component';
import { LimsComponent } from './lims/lims.component';
import {NgxPaginationModule} from "ngx-pagination";
import {UploadComponent} from "./shared/crud/upload/upload.component";

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
    TranslatePipe,
    ReportCreateFileComponent,
    ReportUpdateFileComponent,
    MyChartComponent,
    HabilitationComponent,
    AuditComponent,
    SearchInputComponent,
    ConfirmModalComponent,
    CheckComponent,
    LimsComponent,
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
    NgIdleKeepaliveModule.forRoot(),
    NgxSpinnerModule,
    NgbModule,
    NgxPaginationModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: XhrInterceptor, multi: true},
    CookieService, CanDeactivateGuard,
  ],
  bootstrap: [AppComponent],
  entryComponents: [ConfirmModalComponent]
})
export class AppModule { }
