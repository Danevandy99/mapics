import { AngularFirestore } from '@angular/fire/firestore';
import { filter, map, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { UserSettings } from '../models/user';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserSettingsService {

  userSettings: BehaviorSubject<UserSettings> = new BehaviorSubject<UserSettings>(null);

  constructor(
    private authService: AuthService,
    private store: AngularFirestore
  ) { }

  ngOnInit() {
    this.getUserSettings()
      .subscribe(userSettings => {
        this.userSettings.next(userSettings);
      });
  }

  getUserSettings(): Observable<UserSettings> {
    return this.authService.user.pipe(
      filter(user => !!user),
      switchMap(user => {
        return this.store.collection('users').doc(user.uid).get();
      }),
      map(document => {
        return { ...<object>document.data(), userId: document.id } as UserSettings;
      })
    );
  }
}
