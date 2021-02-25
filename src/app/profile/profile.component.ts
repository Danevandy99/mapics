import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './../shared/service/auth.service';
import { UserSettings } from './../shared/models/user';
import { Component, OnInit } from '@angular/core';
import { filter, first, map, switchMap } from 'rxjs/operators';
import firebase from 'firebase';
import { Post } from '../shared/models/post';
import { Observable } from 'rxjs';

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
  photoSelected;

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
  gridPosts: Post[] = [];
  blankImage: string = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
  userId: string;
  isFollowing: boolean = false;

  constructor(
    private authService: AuthService,
    private store: AngularFirestore,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  get currentUserId(): Observable<string> {
    return this.authService.user
      .pipe(
        filter(user => !!user),
        map(user => user.uid)
      );
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: { id: string}) => {
      this.userId = params.id;

      this.authService.user
      .pipe(
        filter(user => !!user),
        switchMap(user => {
          return this.store.collection('users').doc(user.uid).collection('following').doc(this.userId).get()
        }),
        map(document => document.exists)
      ).subscribe(isFollowing => this.isFollowing = isFollowing);

      this.getUserSettings(this.userId);
      this.getUserPosts(this.userId);
    })
  }

  getUserSettings(id: string) {
    this.store.collection('users').doc(id)
      .get()
      .pipe(
        map(document => {
          return { ...<object>document.data(), userId: document.id } as UserSettings;
        })
      )
      .subscribe((userSettings: UserSettings) => {
        this.userSettings = userSettings;
      });
  }

  getUserPosts(id: string) {
    this.store.collection('users').doc(id).collection('posts')
      .get()
      .pipe(
        map(docs => {
          return docs.docs.map(doc => {
            return { ...<object>doc.data(), postId: doc.id } as Post;
          });
        })
      )
      .subscribe((posts: Post[]) => {
        this.gridPosts = posts;
      });
  }

  async followUser(userIdToFollow: string) {
    const currentUserId = await this.currentUserId.pipe(first()).toPromise();

    this.store.collection('users').doc(currentUserId).collection('following').doc(userIdToFollow).set({ following: true });
    this.store.collection('users').doc(currentUserId).update({
      followingCount: firebase.firestore.FieldValue.increment(1)
    });

    this.store.collection('users').doc(userIdToFollow).collection('followers').doc(currentUserId).set({ follower: true });
    this.store.collection('users').doc(userIdToFollow).update({
      followersCount: firebase.firestore.FieldValue.increment(1)
    });

    this.userSettings.followersCount += 1;

    this.isFollowing = true;
  }

  async unfollowUser(userIdToUnfollow: string) {
    const currentUserId = await this.currentUserId.pipe(first()).toPromise();

    this.store.collection('users').doc(currentUserId).collection('following').doc(userIdToUnfollow).delete();
    this.store.collection('users').doc(currentUserId).update({
      followingCount: firebase.firestore.FieldValue.increment(-1)
    });

    this.store.collection('users').doc(userIdToUnfollow).collection('followers').doc(currentUserId).delete();
    this.store.collection('users').doc(userIdToUnfollow).update({
      followersCount: firebase.firestore.FieldValue.increment(-1)
    });

    this.userSettings.followersCount -= 1;

    this.isFollowing = false;
  }

  refreshUserSettings() {
    this.getUserSettings(this.userId);
  }
}
