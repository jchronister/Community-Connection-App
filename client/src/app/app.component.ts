import { Component, OnDestroy, OnInit } from '@angular/core';
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

  constructor(private router: Router, private state: AccountState) {
    
    // Get Current User
    this.state.subscribeToken( n => {
      this.loggedIn = n !== ""
      this.user = this.state.getCurrentUserInfo().username
    })

  }

  ngOnInit() {
    if (!this.loggedIn) this.router.navigate(['/','accounts','login'])
  }

  logout(no: number) {
    this.state.setToken("")
    if (no) this.router.navigate(['/','accounts','login'])
  }

  ngOnDestroy() {
    if (this.subscriptions) this.subscriptions.unsubscribe()
  }
  
  
}
