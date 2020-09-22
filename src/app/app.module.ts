import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {environment} from '../environments/environment';
import {AngularFireModule} from '@angular/fire';
import { LoginComponent } from './login/login.component';
import {AngularFireAuthModule} from '@angular/fire/auth';
import { NavbarComponent } from './navbar/navbar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from './home/home.component';
import { ServerManagerComponent } from './server-manager/server-manager.component';
import {HttpClientModule} from '@angular/common/http';
import {httpInterceptorProviders} from './shared/http-interceptors';
import {IconsModule} from './shared/modules/icons/icons.module';
import {AngularFireAuthGuard} from '@angular/fire/auth-guard';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavbarComponent,
    HomeComponent,
    ServerManagerComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AppRoutingModule,
    NgbModule,
    IconsModule
  ],
  providers: [AngularFireAuthGuard , httpInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
