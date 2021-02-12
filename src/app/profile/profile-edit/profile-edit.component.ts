import { AngularFireAuth } from '@angular/fire/auth';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { filter, first, map, switchMap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './../../shared/service/auth.service';
import { UserSettings } from './../../shared/models/user';
import { Component, OnInit } from '@angular/core';
import firebase from 'firebase';

interface userFormValue {
  email: string;
  username: string;
  bio: string;
  displayName: string;
  password: string;
}

enum SaveButtonState {
  UNSAVED = 0,
  SAVING = 1,
  SAVED_SUCCESSFULLY = 2,
  NOT_SAVED_SUCCESSFULLY = 3
}

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss']
})
export class ProfileEditComponent implements OnInit {

  SaveButtonState = SaveButtonState;

  user: firebase.User;
  userSettings: UserSettings;
  userForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    username: new FormControl('', [Validators.required]),
    bio: new FormControl('', [Validators.required]),
    displayName: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });
  saveButtonState: SaveButtonState = SaveButtonState.UNSAVED;
  firebaseError: string;

  constructor(
    private authService: AuthService,
    private store: AngularFirestore,
    private auth: AngularFireAuth
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
        email: this.userSettings.email,
        username: this.userSettings.username,
        displayName: this.userSettings.displayName,
        bio: this.userSettings.bio
      });
    });
  }

  getUser() {
    this.authService.user.pipe(
      filter((user: firebase.User) => !!user)
    ).subscribe((user: firebase.User) => {
      this.user = user;
    });
  }

  async saveChanges(form: userFormValue) {
    this.saveButtonState = SaveButtonState.SAVING;

    try {
      // Sign in to make sure password is correct.
      await this.auth.signInWithEmailAndPassword(this.userSettings.email, form.password);

      // If the user changed their email, update their Firebase Auth record.
      if (this.user.email !== form.email) {
        await this.user.updateEmail(form.email);
      }

      // Update user settings
      await this.store.collection('users').doc(this.user.uid).update({
        email: form.email,
        username: form.username,
        bio: form.bio,
        displayName: form.displayName
      });

      // Change button state
      this.saveButtonState = SaveButtonState.SAVED_SUCCESSFULLY;
    } catch(error) {
        this.firebaseError = error.message;
        this.saveButtonState = SaveButtonState.NOT_SAVED_SUCCESSFULLY;
        this.userForm.patchValue({
          email: this.userSettings.email,
          username: this.userSettings.username,
          displayName: this.userSettings.displayName,
          bio: this.userSettings.bio
        });
    } finally {
      setTimeout(() => this.saveButtonState = SaveButtonState.UNSAVED, 5000);
      this.userForm.patchValue({
        password: ''
      });
      this.userForm.controls['password'].markAsPristine();
      this.userForm.controls['password'].markAsUntouched();
    }
   }
}
