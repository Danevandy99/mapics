import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { LogInComponent } from './auth/log-in/log-in.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { ProfileComponent } from './profile/profile.component';

const config = {
  apiKey: "AIzaSyBiBcN3svwTQk_jOdfVz239d0zZX4FKthE",
  authDomain: "mapics-b0365.firebaseapp.com",
  projectId: "mapics-b0365",
  storageBucket: "mapics-b0365.appspot.com",
  messagingSenderId: "775450242286",
  appId: "1:775450242286:web:0418b435adb40f2cc1d7ff",
  measurementId: "G-BBFNGTJ5QD"
};

@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    LogInComponent,
    ForgotPasswordComponent,
    HomeComponent,
    HeaderComponent,
    ProfileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(config),
    AngularFirestoreModule, // firestore
    AngularFireAuthModule, // auth
    AngularFireStorageModule, NgbModule // storage
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
