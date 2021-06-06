import { FixedSizeVirtualScrollStrategy } from "@angular/cdk/scrolling";
import { Component, OnInit, Pipe, PipeTransform } from "@angular/core";
import { Router } from "@angular/router";
import { AccountState } from "../account-state";
import { IUser } from "../app.types";
import { getProperty } from "./account-module-fx"

@Component({

  selector: "profile",

  template: `
  
  <mat-card>
    <mat-card-header>

      <div mat-card-avatar></div>
      <mat-card-title>Username: {{user.username}}</mat-card-title>
      <mat-card-subtitle>{{user.name}}</mat-card-subtitle>

    </mat-card-header>

    <mat-card-content class="cardtext">
      <p>Addess: {{user | formatAddress}}</p>
      <p>Phone: {{user.phone}}</p>
      <p>Email: {{user.email}}</p>
    </mat-card-content>

  </mat-card>
  `,
  styles: [".cardtext {margin:20px}",
           ".cardtext {margin-left:60px}"]

})
export class AccountProfile implements OnInit{

  show = ""
  user = {
    "username": "",
    "name": "",
    "address": "",
    "city": "",
    "state": "",
    "zip": 0,
    "phone": "",
    "email": "",
  }

  constructor (private router: Router, private state: AccountState) {

    // Get State
    const nav = router.getCurrentNavigation()
    this.show = getProperty("extras.state.source", nav) || ""
 
  }

  ngOnInit () {
 
    if(this.show === "currentUser") {
      this.user = this.state.getCurrentUserInfo()
    }

  }



}

@Pipe({
  name: "formatAddress"
})
export class FormatAddress implements PipeTransform{

  transform (n : any) {

    if (!n.address || !n.city || !n.state || !n.zip) {
      return null
    } else {
      return n.address + " " + n.city + " " + n.state + " " + n.zip
    }
  }

}

