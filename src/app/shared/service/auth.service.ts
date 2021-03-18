import { Injectable, NgZone } from '@angular/core';
import { UserSettings } from "../models/user";
import { AngularFireAuth } from "@angular/fire/auth";
import firebase from "firebase";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from "@angular/router";
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: BehaviorSubject<firebase.User> = new BehaviorSubject<firebase.User>(null); // Save logged in user data
  isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(JSON.parse(localStorage.getItem('user')) !== null);

  constructor(
    public store: AngularFirestore,   // Inject Firestore service
    public auth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone // NgZone service to remove outside scope warning
  ) {
    /* Saving user data in localstorage when
    logged in and setting up null when logged out */
    this.auth.authState.subscribe(user => {
      if (user) {
        this.user.next(user);
        this.isLoggedIn.next(true);
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.setItem('user', null);
        this.user.next(null);
        this.isLoggedIn.next(false);
      }
    })
  }

  // Sign in with email/password
  logIn(email, password) {
    return this.auth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.user.next(result.user);
        this.isLoggedIn.next(true);
        this.router.navigate(['home']);
      }).catch((error) => {
        console.log(error.message)
        throw error;
      })
  }

  // Sign up with email/password
  signUp(email, password) {
    return this.auth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        this.setUser(result.user);
        this.user.next(result.user);
        this.isLoggedIn.next(true);
        this.router.navigate(['account-setup']);
      }).catch((error) => {
        console.log(error.message);
        throw error;
      })
  }

  // Reset Forggot password
  forgotPassword(passwordResetEmail) {
    return this.auth.sendPasswordResetEmail(passwordResetEmail)
    .then(() => {
      console.log('Password reset email sent, check your inbox.');
    }).catch((error) => {
      console.log(error)
      throw error;
    })
  }

  /* Setting up user data when sign in with username/password,
  sign up with username/password and sign in with social auth
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  setUser(user: firebase.User) {
    const userRef: AngularFirestoreDocument<any> = this.store.doc(`users/${user.uid}`);
    const userSettings: Partial<UserSettings> = {
      userId: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    }
    return userRef.set(userSettings, {
      merge: true
    })
  }

  // Logout
  logout() {
    if (confirm("Are you sure you want to logout?")) {
      this.auth.signOut().then(() => {
        localStorage.removeItem('user');
        this.router.navigate(['log-in']);
      });
    }
  }

}
