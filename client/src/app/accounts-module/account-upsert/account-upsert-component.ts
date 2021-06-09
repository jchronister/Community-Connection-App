import { Component, Input, OnInit } from "@angular/core";
import { Form, FormControl, FormGroup, Validators } from "@angular/forms";
import { IToken, UserHttp } from "../account-http-service";
import { passwordVerification } from "../account-module-fx";
import { AccountState, ICities } from "../../account-state";

import { Placeholder } from "@angular/compiler/src/i18n/i18n_ast";
import { Router } from "@angular/router";



 



@Component({

  selector: "userUpsert",
  templateUrl: "./account-upsert.html",
  styleUrls: ["./account-upsert.css"]

})
export class AccountUpsert implements OnInit{

  upsertForm: FormGroup
  email: FormControl
  password: FormControl
  username: FormControl
  fullname: FormControl
  city: FormControl
  state: FormControl
  phone: FormControl
  address: FormControl
  zip: FormControl
  locations: Array<ICities>
  submitText = "Submit"
  error = ""
  cities: Array<string>
  states: Set<string>
  zips: Array<number>

  constructor (private http: UserHttp, private appState: AccountState, private router: Router) {

    // Get City/State/Zip
    this.locations = appState.locations() 
    this.states = new Set

    this.cities = this.locations.map (n => {
      this.states.add(n.state)
      return n.city
    })
    this.zips = this.locations.map (n => n.zip)


    this.email = new FormControl("", [Validators.required, Validators.email])
    this.password = new FormControl("", [Validators.required, passwordVerification])
    this.username = new FormControl("", Validators.required)
    this.fullname = new FormControl("", [Validators.required, this.fullNameValidator])
    this.city = new FormControl("", Validators.required)
    this.state = new FormControl("", Validators.required)
    this.address = new FormControl("", Validators.required)
    this.zip = new FormControl("", Validators.required)
    this.phone = new FormControl("", [Validators.required, this.phoneValidation])

    this.upsertForm = new FormGroup({

      email: this.email,
      password: this.password,
      username: this.username,
      fullname: this.fullname,
      address: this.address,
      city: this.city,
      state: this.state,
      zip: this.zip,
      phone: this.phone

    })

    // Reset Error Message
    this.upsertForm.statusChanges.subscribe(()=>this.error="")


  }

  ngOnInit() {



  }


  // Valid = Two Words with Space Between
  fullNameValidator (el: FormControl) {
    return el.value.split(" ")
      .reduce((a: number, n: string) => n.length? a + 1 : a, 0) > 1 ? null :
      {msg: "Invalid Full Name: Need Two Words"}
  }

  // Phone Number XXX-XXX-XXXX
  phoneValidation (el: FormControl) {

    if (/^[0-9][0-9][0-9]-[0-9][0-9][0-9]-[0-9][0-9][0-9][0-9]$/.test(el.value)) {
      return null
    } else {
      return {msg: "Phone Number Invalid. Need XXX-XXX-XXXX Format"}
    }

  }


  upsertSubmit () {

    this.http.createAccount(this.upsertForm.value).subscribe( n=> {

      if (n.status === "Success") {
        this.appState.setToken(n.data)
        const redirect = this.appState.loggedInRedirect()
        this.router.navigate(redirect.path, {state: redirect.state});
      } else {
        this.error = <string>n.error
      }
    },
    (error) => {
      this.error = error.message

    }
    )

  }

}



@Component({
  selector: "cInput",

  template: `

    <mat-form-field>
      <mat-label>{{title}}</mat-label>
      <input type="{{type}}" matInput [formControl]="control!" placeholder="{{placeholder}}">
      <mat-error *ngIf="control!.hasError('email') && control!.hasError('required')">
        Error Message
      </mat-error>  
      <mat-error *ngIf="control!.hasError('required')">
        Required Input
      </mat-error>
    </mat-form-field>

  `
})
export class CustomInput{

  @Input() type = "text"
  @Input() control: FormControl | undefined
  @Input() placeholder = ""
  @Input() title = "input"

}

