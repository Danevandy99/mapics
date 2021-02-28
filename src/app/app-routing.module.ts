import { VerticalFeedComponent } from './profile/vertical-feed/vertical-feed.component';
import { ProfileGridComponent } from './profile/profile-grid/profile-grid.component';
import { ProfileHighlightsComponent } from './profile/profile-highlights/profile-highlights.component';
import { CreatePostComponent } from './create-post/create-post.component';
import { ProfileEditComponent } from './profile/profile-edit/profile-edit.component';
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './home/home.component';
import { LogInComponent } from './auth/log-in/log-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'log-in', component: LogInComponent },
  { path: 'home', component: HomeComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'profile/edit', component: ProfileEditComponent },
  { path: 'profile/:id', component: ProfileComponent,
    children: [
      { path: '', redirectTo: 'highlights', pathMatch: 'full' },
      { path: 'highlights', component: ProfileHighlightsComponent },
      { path: 'grid', component: ProfileGridComponent },
      { path: 'vertical-feed', component: VerticalFeedComponent }
    ]
  },
  { path: 'create-post', component: CreatePostComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
