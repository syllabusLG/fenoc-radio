import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AngularDraggableModule} from 'angular2-draggable';

import {AppComponent} from './app.component';
import {SidebarComponent} from './sidebar/sidebar.component';
import {NavbarComponent} from './navbar/navbar.component';
import {LoginComponent} from './login/login.component';
import {ContentComponent} from './content/content.component';
import {AppRoutingModule} from './app.routing.module';
import {HomeComponent} from './home/home.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {XhrInterceptor} from './xhr.interceptor';
import {CookieService} from 'ngx-cookie-service';
import {UserComponent} from './user/user.component';
import {StoreModule} from '@ngrx/store';
import {principalReducer} from './shared/principal.reducer';
import {CrudComponent} from './shared/crud/crud.component';
import {SampleComponent} from './shared/crud/sample/sample.component';
import {TranslatePipe} from "./common/pipes/translate.pipe";
import {ChartModule} from 'angular2-chartjs';
import {TreeviewModule} from 'ngx-treeview';
import {MomentModule} from "angular2-moment";
import {NgIdleKeepaliveModule} from "@ng-idle/keepalive";
import {SearchInputComponent} from './shared/search-input/search-input.component';
import {NgxSpinnerModule} from 'ngx-spinner';
import {CanDeactivateGuard} from './shared/crud/upload/can-deactivate-guard.service';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ConfirmModalComponent} from './common/confirm-modal/confirm-modal.component';
import {CheckComponent} from './check/check.component';
import {LimsComponent} from './lims/lims.component';
import {NgxPaginationModule} from "ngx-pagination";
import {UploadComponent} from "./shared/crud/upload/upload.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";


@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    NavbarComponent,
    LoginComponent,
    ContentComponent,
    HomeComponent,
    UploadComponent,
    UserComponent,
    CrudComponent,
    SampleComponent,
    TranslatePipe,
    SearchInputComponent,
    ConfirmModalComponent,
    CheckComponent,
    LimsComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
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
    NgxPaginationModule,
    MatProgressSpinnerModule,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: XhrInterceptor, multi: true},
    CookieService, CanDeactivateGuard,
  ],
  bootstrap: [AppComponent],
  entryComponents: [ConfirmModalComponent]
})
export class AppModule {
}
