import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './../shared/service/auth.service';
import { UserSettings } from './../shared/models/user';
import { Component, OnInit } from '@angular/core';
import { filter, map, switchMap } from 'rxjs/operators';
import firebase from 'firebase';

export enum ProfileTabState {
  HIGHLIGHTS = 0,
  GRID = 1,
  VERTICAL = 2
};

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  // This looks weird, but it's so we can access the enum in the html
  ProfileTabState = ProfileTabState;

  userSettings: UserSettings;
  profileTabState: ProfileTabState = ProfileTabState.HIGHLIGHTS;
  highlights: string[] = [
    "https://images.unsplash.com/photo-1612440455990-785cd7ac50ef?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1234&q=80",
    "https://images.unsplash.com/photo-1612640674553-2dd819ac3be8?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=975&q=80",
    "https://images.unsplash.com/photo-1609080215301-ae20efbc32a8?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1612712590265-27d523d95f43?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80",
    "https://images.unsplash.com/photo-1612717850360-8f8452ddc72a?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1001&q=80",
    "https://images.unsplash.com/photo-1612698977733-6a35ecd94b5f?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1567&q=80",
  ];
  gridPosts: string[] = [...this.highlights];

  constructor(
    private authService: AuthService,
    private store: AngularFirestore
  ) { }

  ngOnInit(): void {
    this.getUserSettings();
  }

  getUserSettings() {
    this.authService.user.pipe(
      filter(user => !!user),
      switchMap((user: firebase.User) => {
        return this.store.collection('users').doc(user.uid).get();
      }),
      map(document => {
        return { ...<object>document.data(), userId: document.id } as UserSettings;
      })
    )
    .subscribe((userSettings: UserSettings) => {
      this.userSettings = userSettings;
    });
  }
}
