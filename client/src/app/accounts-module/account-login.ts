import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { UserHttp } from "./account-http";
import { passwordVerification } from "./account-module-fx";
import { AccountState } from "../account-state";
import { Subscription } from "rxjs";



@Component({

  selector: "account-login",
  template: `
  
    <form [formGroup] = signinForm (ngSubmit)="login()">

    <!-- Username -->
    <mat-form-field class="example-full-width">
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
    <mat-form-field class="example-full-width">
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

    </div>

    </form>

    <h2 class="error">{{error}}</h2>
    
  `,

  styles: [".error {color: red}"]

})
export class AccountLogin implements OnInit, OnDestroy{

  signinForm: FormGroup
  username: FormControl
  password: FormControl
  error = ""
  subscriptions: Subscription | undefined 

  constructor (private formBuilder: FormBuilder, private router: Router, private http: UserHttp, private userState: AccountState) {

    this.username = new FormControl("", [Validators.required, Validators.email])
    this.password = new FormControl("", [Validators.required, passwordVerification])

    this.signinForm = new FormGroup({

      username: this.username,
      password: this.password

    })

  }

  ngOnInit () {

    // Reset Errors
    this.subscriptions = this.signinForm.statusChanges.subscribe(
      () => this.error = ""
    )

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

    this.http.login(this.signinForm.value).subscribe( n => {
debugger
      if (n.status === "Success") {

        // this.userState.logIn(n.data)
      
      } else {

        // Error
        this.error = <string>n.error

      }   
  },
    (error) =>{
      console.log(error)
      this.error = <string>error.message
  debugger
    }
      )
      
    
  }


  ngOnDestroy() {
    if (this.subscriptions) this.subscriptions.unsubscribe()
  }

}