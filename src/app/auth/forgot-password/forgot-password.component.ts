import { AuthService } from './../../shared/service/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  forgotPasswordForm: FormGroup = new FormGroup({
    emailAddress: new FormControl('', [Validators.required, Validators.email])
  });
  firebaseError: string;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
  }

  forgotPassword(formValue: { emailAddress: string }) {
    this.firebaseError = null;
    this.authService.forgotPassword(formValue.emailAddress)
      .catch(error => {
        this.firebaseError = error.message;
      })
  }
}
