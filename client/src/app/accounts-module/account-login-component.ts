import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UserHttp } from './account-http-service';
import { passwordVerification } from './account-module-fx';
import { AccountState } from '../account-state';
import { Subscription } from 'rxjs';

@Component({
  selector: 'account-login',
  template: `
    <div class="input, centered">
      <h2 class="center">Please Login or Continue as Guest</h2>
      <h4 class="center">Guests are Only Allowed to View Content (No Posting)</h4>
      <form [formGroup]="signinForm" (ngSubmit)="login()">

        <!-- Username -->
        <div>
          
          <mat-form-field class="input">

            <mat-label>Email</mat-label>

            <input
              type="email"
              matInput
              [formControl]="username"
              placeholder="username@domain.com"/>

            <mat-error
              *ngIf="username.hasError('email') && !username.hasError('required')"
              >Please Enter A Valid Email Address</mat-error>
            
            <mat-error *ngIf="username.hasError('required')"
              >Email is Required</mat-error>

          </mat-form-field>

          <!-- Password -->
          <mat-form-field class="input">
            <mat-label>Password</mat-label>
            <input
              type="text"
              matInput
              [formControl]="password"
              placeholder="At Least 4 Characters"/>
          </mat-form-field>

          <div class="center">
            <button
              type="submit"
              color="primary"
              mat-raised-button
              [disabled]="!signinForm.valid"
            >Login</button>

            <button
              class="leftMargin"
              type="button"
              color="secondary"
              mat-raised-button
              (click)="continueAsGuest()"
            >Continue as Guest</button>
          </div>
        </div>
      </form>

      <h2 class="error">{{ error }}</h2>
   
    </div>
  `,

  styleUrls: ["./account-login.css"],
})
export class AccountLogin implements OnInit, OnDestroy {
  signinForm: FormGroup;
  username: FormControl;
  password: FormControl;
  error = '';
  subscriptions: Subscription | undefined;

  constructor(
    private router: Router,
    private http: UserHttp,
    private state: AccountState
  ) {
  
    this.username = new FormControl('bregmi@miu.edu', [
      Validators.required,
      Validators.email,
    ]);
    this.password = new FormControl('1234', [
      Validators.required,
      passwordVerification,
    ]);

    this.signinForm = new FormGroup({
      email: this.username,
      password: this.password,
    });
  }

  ngOnInit() {
    // Reset Errors
    this.subscriptions = this.signinForm.statusChanges.subscribe(
      () => (this.error = '')
    );

    // Subscribe to Errors
    // this.subscriptions.add(this.userState.getState("errors")
    //   .subscribe( n => { this.error = <string>n})
    // )

    // this.subscriptions.add(this.userState
    //   .subscribe("errors", n => { this.error = <string>n})
    // )
    // debugger
    
  }

  // Login with Server
  login() {
    console.log(this.signinForm)
    // console.log(typeof(this.username.value),this.username.value)
    
    // Send Login Request
    this.http.login(this.signinForm.value).subscribe(
      (n) => {
        if (n.status === 'Success') {
          this.state.setToken(n.data);
          const redirect = this.state.loggedInRedirect()
          this.router.navigate(redirect.path, {state: redirect.state});
        } else {
          this.error = <string>n.error;
        }
      },
      (error) => {
        console.log(error);
        this.error = <string>error.message;
      }
    );
  }

  continueAsGuest() {
    this.state.setToken(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZGRyZXNzIjpudWxsLCJjaXR5IjpudWxsLCJlbWFpbCI6Imd1ZXN0IiwibmFtZSI6Imd1ZXN0IiwicGhvbmUiOm51bGwsInN0YXRlIjpudWxsLCJ1c2VybmFtZSI6Imd1ZXN0IiwiemlwIjpudWxsLCJfaWQiOm51bGwsImlhdCI6MTYyMjkwOTk3OH0.mlt3sUGWdeNV0EyzZIn5OoWmlC1A_twv4w_4o2TopFs'
    );
    
    const redirect = this.state.loggedInRedirect()
    this.router.navigate(redirect.path, {state: redirect.state});
  }

  ngOnDestroy() {
    if (this.subscriptions) this.subscriptions.unsubscribe();
  }
}
