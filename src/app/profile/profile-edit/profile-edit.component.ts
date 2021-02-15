import { AngularFireAuth } from '@angular/fire/auth';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { filter, first, map, switchMap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './../../shared/service/auth.service';
import { UserSettings } from './../../shared/models/user';
import { Component, OnInit } from '@angular/core';
import firebase from 'firebase';

interface userFormValue {
  email: string;
  newPassword: string;
  newPasswordConfirmation: string;
  password: string;
}

interface userSettingsFormValue {
  username: string;
  bio: string;
  displayName: string;
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
    newPassword: new FormControl('', [Validators.minLength(8)]),
    newPasswordConfirmation: new FormControl('', [Validators.minLength(8)]),
    password: new FormControl('', [Validators.required])
  }, [this.passwordsMatch]);

  userSettingsForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    bio: new FormControl('', [Validators.required]),
    displayName: new FormControl('', [Validators.required])
  });

  saveUserButtonState: SaveButtonState = SaveButtonState.UNSAVED;
  saveUserSettingsButtonState: SaveButtonState = SaveButtonState.UNSAVED;

  saveUserFirebaseError: string;
  saveUserSettingsFirebaseError: string;

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
        email: this.userSettings.email
      });

      this.userSettingsForm.patchValue({
        username: this.userSettings.username,
        displayName: this.userSettings.displayName,
        bio: this.userSettings.bio
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

  async saveUserChanges(form: userFormValue) {
    this.saveUserButtonState = SaveButtonState.SAVING;

    try {
      // Sign in to make sure password is correct.
      // Also, make sure to use the userSetting.email instead of the form.email.
      // Otherwise this will try to sign the user in with their new email they just submitted.
      await this.auth.signInWithEmailAndPassword(this.userSettings.email, form.password);

      // If the user changed their email, update their Firebase Auth record.
      if (this.user.email !== form.email) {
        await this.user.updateEmail(form.email);
        // If the email is updated successfully, make sure the userSettings.email gets updated,
        // otherwise future settings updates while on this page will continue to use the old password.
        this.userSettings.email = form.email;

        await this.store.collection('users').doc(this.user.uid).update({
          email: form.email
        });
      }

      // Check if the user updated their password by checking that their new password does not
      // match their old password entered to make changes and that the new password is not empty.
      if (form.newPassword && form.password !== form.newPassword) {
        await this.user.updatePassword(form.newPassword);
      }

      // Change button state
      this.saveUserButtonState = SaveButtonState.SAVED_SUCCESSFULLY;
    } catch(error) {
        this.saveUserFirebaseError = error.message;
        this.saveUserButtonState = SaveButtonState.NOT_SAVED_SUCCESSFULLY;
        this.userForm.patchValue({
          email: this.userSettings.email
        });
    } finally {
      setTimeout(() => this.saveUserButtonState = SaveButtonState.UNSAVED, 5000);
      this.userForm.patchValue({
        password: '',
        newPassword: '',
        newPasswordConfirmation: '',
      });

      this.userForm.controls['password'].markAsPristine();
      this.userForm.controls['password'].markAsUntouched();
      this.userForm.controls['newPassword'].markAsPristine();
      this.userForm.controls['newPassword'].markAsUntouched();
      this.userForm.controls['newPasswordConfirmation'].markAsPristine();
      this.userForm.controls['newPasswordConfirmation'].markAsUntouched();
    }
   }

   async saveUserSettingsChanges(form: userSettingsFormValue) {
    this.saveUserSettingsButtonState = SaveButtonState.SAVING;

    try {
      // TODO: Make sure username is not taken before updating a user.
      const matchingUsernamesCount = await this.store.collection('users', ref => ref.where('username', '==', form.username))
        .get()
        .pipe(
          map(snapshot => snapshot.docs.length)
        )
        .toPromise();

      if (matchingUsernamesCount > 0) {
        throw { message: form.username + ' is already in use. Please choose another username' };
      }

      // Update user settings
      await this.store.collection('users').doc(this.user.uid).update({
        username: form.username,
        bio: form.bio,
        displayName: form.displayName
      });

      this.saveUserSettingsButtonState = SaveButtonState.SAVED_SUCCESSFULLY;
    } catch(error) {
      this.saveUserSettingsFirebaseError = error.message;
      this.saveUserSettingsButtonState = SaveButtonState.NOT_SAVED_SUCCESSFULLY;
      this.userSettingsForm.patchValue({
        username: this.userSettings.username,
        displayName: this.userSettings.displayName,
        bio: this.userSettings.bio
      });
    } finally {
      setTimeout(() => this.saveUserSettingsButtonState = SaveButtonState.UNSAVED, 5000);
    }
   }

   passwordsMatch(control: AbstractControl): { passwordsDoNotMatch: boolean } {
    return (control.get('newPassword').value !== control.get('newPasswordConfirmation').value) ? { passwordsDoNotMatch: true } : null;
  }
}
