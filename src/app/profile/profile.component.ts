import { UserService } from '../shared/service/user-settings.service';
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

  userSettings: UserSettings;
  posts: Post[] = [];
  blankImage: string = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
  userId: string;
  isFollowing: boolean = false;

  constructor(
    private authService: AuthService,
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

      this.userService.isFollowingUser(this.userId)
        .subscribe(isFollowing => this.isFollowing = isFollowing);

      this.getUserSettings(this.userId);
    })
  }

  async followUser(userIdToFollow: string) {
    await this.userService.followUser(userIdToFollow);
    this.userSettings.followersCount += 1;
    this.isFollowing = true;
  }

  async unfollowUser(userIdToUnfollow: string) {
    await this.userService.unfollowUser(userIdToUnfollow);
    this.userSettings.followersCount -= 1;
    this.isFollowing = false;
  }

  getUserSettings(userId: string) {
    this.userService.getUserSettings(userId)
        .subscribe(userSettings => this.userSettings = userSettings);
  }
}
