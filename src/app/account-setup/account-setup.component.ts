import { Router } from '@angular/router';
import { AuthService } from './../shared/service/auth.service';
import { UserSettings } from './../shared/models/user';
import { AngularFirestore } from '@angular/fire/firestore';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { filter, map } from 'rxjs/operators';
import firebase from 'firebase';

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
  selector: 'app-account-setup',
  templateUrl: './account-setup.component.html',
  styleUrls: ['./account-setup.component.scss']
})
export class AccountSetupComponent implements OnInit {

  SaveButtonState = SaveButtonState;

  progress = 0;
  user: firebase.User;
  userSettingsForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    bio: new FormControl('', [Validators.required]),
    displayName: new FormControl('', [Validators.required])
  });
  saveUserSettingsButtonState: SaveButtonState = SaveButtonState.UNSAVED;
  saveUserSettingsFirebaseError: string;

  constructor(
    private store: AngularFirestore,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    this.authService.user.pipe(
      filter((user: firebase.User) => !!user)
    ).subscribe((user: firebase.User) => {
      this.user = user;
    });
  }

  async saveUserSettingsChanges(form: userSettingsFormValue) {
    this.saveUserSettingsFirebaseError = null;
   this.saveUserSettingsButtonState = SaveButtonState.SAVING;

   try {
     // Make sure username is not taken before updating a user.
     const matchingUsernamesCount = await this.store.collection('users', ref => ref.where('username', '==', form.username))
       .get()
       .pipe(
         map(snapshot => snapshot.docs.filter(doc => doc.id !== this.user.uid).length)
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
     setTimeout(() => this.router.navigateByUrl('/home'), 1000);
   } catch(error) {
     this.saveUserSettingsFirebaseError = error.message;
     this.saveUserSettingsButtonState = SaveButtonState.NOT_SAVED_SUCCESSFULLY;
     this.userSettingsForm.patchValue({
       username: '',
       displayName: '',
       bio: ''
     });
   } finally {
     setTimeout(() => this.saveUserSettingsButtonState = SaveButtonState.UNSAVED, 5000);
   }
  }

}
