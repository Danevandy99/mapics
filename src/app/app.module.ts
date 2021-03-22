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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './profile/profile.component';
import { ProfileEditComponent } from './profile/profile-edit/profile-edit.component';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { PostComponent } from './components/post/post.component';
import { ChangeProfilePhotoPopupComponent } from './profile/change-profile-photo-popup/change-profile-photo-popup.component';
import { CreatePostComponent } from './create-post/create-post.component';
import { WebcamModule } from 'ngx-webcam';
import { CommentComponent } from './components/post/comment/comment.component';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { ReactionComponent } from './components/post/reaction/reaction.component';
import { FollowPopupComponent } from './profile/follow-popup/follow-popup.component';
import { ProfileHighlightsComponent } from './profile/profile-highlights/profile-highlights.component';
import { ProfileGridComponent } from './profile/profile-grid/profile-grid.component';
import { VerticalFeedComponent } from './components/vertical-feed/vertical-feed.component';
import { environment } from '../environments/environment';
import { AccountSetupComponent } from './account-setup/account-setup.component';
import { ProfileVerticalFeedComponent } from './profile/profile-vertical-feed/profile-vertical-feed.component';
import { MessagesComponent } from './messages/messages.component';

const config = {
  apiKey: environment.FIREBASE_API_KEY,
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
    ProfileEditComponent,
    PostComponent,
    ChangeProfilePhotoPopupComponent,
    CreatePostComponent,
    CommentComponent,
    ReactionComponent,
    FollowPopupComponent,
    ProfileHighlightsComponent,
    ProfileGridComponent,
    VerticalFeedComponent,
    AccountSetupComponent,
    VerticalFeedComponent,
    ProfileVerticalFeedComponent,
    MessagesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(config),
    AngularFirestoreModule, // firestore
    AngularFireAuthModule, // auth
    AngularFireStorageModule, // storage
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    WebcamModule,
    PickerModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas, far);
  }
}
