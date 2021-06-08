import { newArray } from '@angular/compiler/src/util';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AccountState } from './account-state';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy{

  loggedIn = false
  subscriptions: Subscription | undefined
  user : string | null = null
  activeLink = ""
  locations = ["Burlington-IA", "Fair Field-IA"]
  location = new FormControl("")

  constructor(private router: Router, private state: AccountState) {
 
    // Get Current User
    this.subscriptions = this.state.subscribeToken( n => {
      
      this.loggedIn = n !== ""
      const user = this.state.getCurrentUserInfo()
      this.user = user.username

      // Default to Burlington IA
      if (user.username === "guest") {
        this.location.setValue("Burlington-IA")
        this.state.setLocation("Burlington-IA")
      } else if (user.city && user.state) {
        this.location.setValue(user.city + "-" + user.state)
        this.state.setLocation(user.city + "-" + user.state)
      } else {
        this.location.setValue("")
        this.state.setLocation("")
      }
      
    })

    this.location.valueChanges.subscribe(n=> {
      this.state.setLocation(n)
    })
    

    // Setup Active Link
    this.subscriptions.add(this.state.subscribeTab (n => {
      this.activeLink = <string>n 
    }))

  }

  ngOnInit() {
    if (!this.loggedIn) {
      this.router.navigate(['/','accounts','login'])
      this.activeLink = "login"
    }
  }

  logout(no: number) {
    this.state.setToken("")
    if (no) this.router.navigate(['/','accounts','login'])
    this.activeLink = "login"
  }

  ngOnDestroy() {
    if (this.subscriptions) this.subscriptions.unsubscribe()
  }

  getLocation() {
    alert(1)
  }
  
}
