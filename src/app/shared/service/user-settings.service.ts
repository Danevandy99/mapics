import { AngularFirestore } from '@angular/fire/firestore';
import { filter, map, switchMap, take, tap, first } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { UserSettings } from '../models/user';
import { Observable, BehaviorSubject } from 'rxjs';
import firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class UserSettingsService {

  private _currentUserSettings: BehaviorSubject<UserSettings> = new BehaviorSubject<UserSettings>(null);
  public currentUserSettings$: Observable<UserSettings> = this._currentUserSettings.asObservable().pipe(
    filter(userSettings => !!userSettings),
    tap(userSettings => this.cacheCurrentUserSettings(userSettings)),
  );
  private _currentUserFollowingIds: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(null);
  public currentUserFollowingIds$: Observable<string[]> = this._currentUserFollowingIds.asObservable().pipe(
    filter(followerIds => !!followerIds)
  );

  constructor(
    private authService: AuthService,
    private store: AngularFirestore
  ) {
    this.getCurrentUserSettings()
      .subscribe(userSettings => {
        this._currentUserSettings.next(userSettings);
      });

    this.getCurrentUserFollowingIds()
      .subscribe(followerIds => {
        this._currentUserFollowingIds.next(followerIds);
      })
   }
  public getCurrentUserFollowingIds() {
    return this.authService.user.pipe(
      filter(user => !!user),
      switchMap(user => {
        return this.store.collection('users').doc(user.uid).collection('following').get();
      }),
      map(documents => {
        return documents.docs.map(document => {
          return document.id;
        });
      })
    )
  }

  public async followUser(userIdToFollow: string) {
    let currentUserSettings = await this._currentUserSettings.pipe(first()).toPromise();
    if (currentUserSettings.followingCount) {
      currentUserSettings.followingCount += 1;
    } else {
      currentUserSettings.followingCount = 1;
    }


    this.store.collection('users').doc(currentUserSettings.userId).collection('following').doc(userIdToFollow).set({ following: true });
    this.store.collection('users').doc(currentUserSettings.userId).update({
      followingCount: firebase.firestore.FieldValue.increment(1)
    });

    this.store.collection('users').doc(userIdToFollow).collection('followers').doc(currentUserSettings.userId).set({ follower: true });
    this.store.collection('users').doc(userIdToFollow).update({
      followersCount: firebase.firestore.FieldValue.increment(1)
    });

    // Add to our cached version of following
    this._currentUserFollowingIds.next([...this._currentUserFollowingIds.value, userIdToFollow]);
  }

  public async unfollowUser(userIdToUnfollow) {
    let currentUserSettings = await this._currentUserSettings.pipe(first()).toPromise();
    currentUserSettings.followingCount -= 1;

    this.store.collection('users').doc(currentUserSettings.userId).collection('following').doc(userIdToUnfollow).delete();
    this.store.collection('users').doc(currentUserSettings.userId).update({
      followingCount: firebase.firestore.FieldValue.increment(-1)
    });

    this.store.collection('users').doc(userIdToUnfollow).collection('followers').doc(currentUserSettings.userId).delete();
    this.store.collection('users').doc(userIdToUnfollow).update({
      followersCount: firebase.firestore.FieldValue.increment(-1)
    });

    // Remove from our cached version of following
    this._currentUserFollowingIds.next(this._currentUserFollowingIds.value.filter(id => id !== userIdToUnfollow));
  }

  public isFollowingUser(userId: string): Observable<boolean> {
    return this.authService.user
      .pipe(
        filter(user => !!user),
        switchMap(user => {
          return this.store.collection('users').doc(user.uid).collection('following').doc(userId).get()
        }),
        map(document => document.exists)
      );
  }

  public async saveUserSettings(userSettings: UserSettings): Promise<UserSettings> {
    try {
      await this.store.collection('users').doc(userSettings.userId).update(userSettings);
    } catch(error) {
      console.log(error);
    }

    return userSettings;
  }

  public getUserSettings(userId: string): Observable<UserSettings> {
    return this.store.collection('users').doc(userId)
      .get()
      .pipe(
        map(document => {
          return { ...<object>document.data(), userId: document.id } as UserSettings;
        })
      );
  }

  public async saveCurrentUserSettings(userSettings: UserSettings): Promise<UserSettings> {
    await this.saveUserSettings(userSettings);
    this._currentUserSettings.next(userSettings);
    return userSettings;
  }

  private getCurrentUserSettings(): Observable<UserSettings> {
    return this.authService.user.pipe(
      filter(user => !!user),
      switchMap(user => {
        return this.getUserSettings(user.uid)
      })
    );
  }

  private cacheCurrentUserSettings(userSettings: UserSettings): void {
    localStorage.setItem('currentUserSettings', JSON.stringify(userSettings));
  }
}
