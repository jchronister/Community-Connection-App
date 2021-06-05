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

  constructor(private router: Router, private state: AccountState) {
    this.state.subscribeToken( n => this.loggedIn = n !== "")
  }

  ngOnInit() {
    if (!this.loggedIn) this.router.navigate(['/','accounts','login'])
  }

  logout() {
    this.state.setToken("")
  }

  ngOnDestroy() {
    if (this.subscriptions) this.subscriptions.unsubscribe()
  }
  
  
}
