import { ProfileVerticalFeedComponent } from './profile/profile-vertical-feed/profile-vertical-feed.component';
import { AccountSetupComponent } from './account-setup/account-setup.component';
import { AuthGuardService } from './shared/guards/auth-guard.service';
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
  { path: 'home', component: HomeComponent, canActivate: [AuthGuardService] },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'profile/edit', component: ProfileEditComponent, canActivate: [AuthGuardService] },
  { path: 'account-setup', component: AccountSetupComponent, canActivate: [AuthGuardService] },
  { path: 'profile/:id', component: ProfileComponent, canActivate: [AuthGuardService],
    canActivateChild: [AuthGuardService],
    children: [
      { path: '', redirectTo: 'highlights', pathMatch: 'full' },
      { path: 'highlights', component: ProfileHighlightsComponent },
      { path: 'grid', component: ProfileGridComponent },
    ]
  },
  { path: 'profile/:id/vertical-feed', component: ProfileVerticalFeedComponent },
  { path: 'create-post', component: CreatePostComponent, canActivate: [AuthGuardService] },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
