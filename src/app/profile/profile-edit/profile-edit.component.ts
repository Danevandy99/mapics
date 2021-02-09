import { FormGroup, FormControl, Validators } from '@angular/forms';
import { filter, map, switchMap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './../../shared/service/auth.service';
import { UserSettings } from './../../shared/models/user';
import { Component, OnInit } from '@angular/core';
import firebase from 'firebase';

interface userFormValue {
  email: string;
  username: string;
  bio: string;
}

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss']
})
export class ProfileEditComponent implements OnInit {
  user: firebase.User;
  userSettings: UserSettings;
  userForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required]),
    username: new FormControl('', [Validators.required]),
    bio: new FormControl('', [Validators.required])
  })

  constructor(
    private authService: AuthService,
    private store: AngularFirestore
  ) { }

  ngOnInit(): void {
    this.getUser();
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
      this.userForm.patchValue({
        email: this.userSettings.email
      })
    });
  }

  getUser() {
    this.authService.user.pipe(
      filter((user: firebase.User) => !!user)
    ).subscribe((user: firebase.User) => {
      this.user = user;
    });
  }

  saveChanges(form: userFormValue) {
    this.store.collection('users').doc(this.user.uid).update({
      email: form.email,
      username: form.username,
      bio: form.bio
    })
   }
}
