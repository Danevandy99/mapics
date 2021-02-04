import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from './../../shared/service/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent implements OnInit {

  logInForm: FormGroup = new FormGroup({
    emailAddress: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });
  firebaseError: string;

  constructor(
    public authService: AuthService
  ) { }

  ngOnInit(): void {
  }

  logIn(formValue: { emailAddress: string, password: string }) {
    this.firebaseError = null;
    this.authService.logIn(formValue.emailAddress, formValue.password)
      .catch(error => {
        this.firebaseError = error.message;
      })
  }
}
