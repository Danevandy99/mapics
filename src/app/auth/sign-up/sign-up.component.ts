import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from './../../shared/service/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  signUpForm: FormGroup = new FormGroup({
    emailAddress: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    passwordConfirmation: new FormControl('', [Validators.required, Validators.minLength(8)])
  }, [this.passwordsMatch]);
  firebaseError: string;

  constructor(
    public authService: AuthService
  ) { }

  ngOnInit(): void {
  }

  signUp(formValue: { emailAddress: string, password: string, passwordConfirmation: string }) {
    this.firebaseError = null;
    this.authService.signUp(formValue.emailAddress, formValue.password)
      .catch(error => {
        this.firebaseError = error.message;
      });
  }

  passwordsMatch(control: AbstractControl): { passwordsDoNotMatch: boolean } {
    return (control.get('password').value !== control.get('passwordConfirmation').value) ? { passwordsDoNotMatch: true } : null;
  }
}
