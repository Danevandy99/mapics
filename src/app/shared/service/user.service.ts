import { AngularFirestore } from '@angular/fire/firestore';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { UserSettings } from '../models/user';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _currentUserSettings: BehaviorSubject<UserSettings> = new BehaviorSubject<UserSettings>(JSON.parse(localStorage.getItem('currentUserSettings')));
  public currentUserSettings$: Observable<UserSettings> = this._currentUserSettings.asObservable().pipe(
    filter(userSettings => !!userSettings),
    tap(userSettings => this.cacheUserSettings(userSettings))
  );

  constructor(
    private authService: AuthService,
    private store: AngularFirestore
  ) { }

  ngOnInit() {
    this.getCurrentUserSettings()
      .subscribe(userSettings => {
        this._currentUserSettings.next(userSettings);
      });
  }

  public async updateUserSettings(userSettings: UserSettings): Promise<void> {
    try {
      await this.store.collection('users').doc(userSettings.userId).update(userSettings);

      this._currentUserSettings.next(userSettings);
    } catch(error) {
      console.log(error);
    }
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

  private getCurrentUserSettings(): Observable<UserSettings> {
    return this.authService.user.pipe(
      filter(user => !!user),
      switchMap(user => {
        return this.getUserSettings(user.uid)
      })
    );
  }

  private cacheUserSettings(userSettings: UserSettings): void {
    localStorage.setItem('currentUserSettings', JSON.stringify(userSettings));
  }
}
