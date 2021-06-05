import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UserHttp } from './account-http';
import { passwordVerification } from './account-module-fx';
import { AccountState } from '../account-state';
import { Subscription } from 'rxjs';

@Component({
  selector: 'account-login',
  template: `

  <div class="input">
    <h2>The One Community Forum</h2>
  
    <form [formGroup] = signinForm (ngSubmit)="login()">

    <!-- Username -->
    <div>
    <mat-form-field class="input">
      <mat-label>Email</mat-label>
      <input type="email" matInput [formControl]="username" placeholder="username@domain.com">
      <mat-error *ngIf="username.hasError('email') && !username.hasError('required')">
        Please Enter A Valid Email Address
      </mat-error>  
      <mat-error *ngIf="username.hasError('required')">
        Email is Required
      </mat-error>
    </mat-form-field>



    <!-- Password -->
    <mat-form-field class="input">
      <mat-label>Password</mat-label>
      <input type="text" matInput [formControl]="password" placeholder="At Least 5 Characters">
      <!-- <mat-error *ngIf="password.hasError('password') && !password.hasError('required')">
        Please Enter A Valid Email Address
      </mat-error>
      <mat-error *ngIf="password.hasError('required')">
        {{password.errors.msg || 'd'}}
      </mat-error> -->
    </mat-form-field>

    <div>
      <button 
        type="submit"
        color="primary" 
        mat-raised-button 
        [disabled]="!signinForm.valid">Login</button>


    <button 
    type="button"
    color="secondary" 
    mat-raised-button 
    (click)="continueAsGuest()">Continue as Guest</button>
</div>
    </div>
   

    </form>

    <h2 class="error">{{error}}</h2>
  </div>
  `,

  styles: [".error {color: red}",

  ".input {margin:20px}"
]

})
export class AccountLogin implements OnInit, OnDestroy{

  signinForm: FormGroup
  username: FormControl
  password: FormControl
  error = ""
  subscriptions: Subscription | undefined 

  constructor (private formBuilder: FormBuilder, private router: Router, private http: UserHttp, private state: AccountState) {

    this.username = new FormControl("", [Validators.required, Validators.email])
    this.password = new FormControl("", [Validators.required, passwordVerification])

    this.signinForm = new FormGroup({

      email: this.username,
      password: this.password

    })

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
  }

  // Login with Server
  login () {

    // Send Login Request
    this.http.login(this.signinForm.value).subscribe( n => {

      if (n.status === "Success") {

        this.state.setToken(n.data)
        this.router.navigate(this.state.loggedInRedirect())
      
      } else {

        this.error = <string>n.error

      }   
  },
    (error) =>{
      console.log(error)
      this.error = <string>error.message
    }
      )
      
    
  }
  
  continueAsGuest () {
    this.state.setToken("eyJ1c2VybmFtZSI6Ikd1ZXN0In0=")
    this.router.navigate(this.state.loggedInRedirect())
  }

  ngOnDestroy() {
    if (this.subscriptions) this.subscriptions.unsubscribe();
  }
}
