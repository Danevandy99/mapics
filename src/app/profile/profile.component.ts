import { UserService } from './../shared/service/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './../shared/service/auth.service';
import { UserSettings } from './../shared/models/user';
import { Component, OnInit, SimpleChanges } from '@angular/core';
import { filter, first, map, switchMap } from 'rxjs/operators';
import firebase from 'firebase';
import { Post } from '../shared/models/post';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  photoSelected;

  userSettings$: Observable<UserSettings>;
  posts: Post[] = [];
  blankImage: string = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
  userId: string;
  isFollowing: boolean = false;

  constructor(
    private authService: AuthService,
    private store: AngularFirestore,
    private router: Router,
    private route: ActivatedRoute,
    public userService: UserService
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

      this.userSettings$ = this.userService.getUserSettings(this.userId);
    })
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

    //this.userSettings.followersCount += 1;

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

    //this.userSettings.followersCount -= 1;

    this.isFollowing = false;
  }

  refreshUserSettings() {
    this.userSettings$ = this.userService.getUserSettings(this.userId);
  }
}
