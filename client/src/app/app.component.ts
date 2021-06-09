import { newArray } from '@angular/compiler/src/util';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AccountState } from './account-state';
import { PostNotification } from './post-notification';


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
  newNotifications = 0
  notificationTimerId: undefined | ReturnType<typeof setTimeout>

  constructor(private router: Router, private state: AccountState, public notification: PostNotification) {
 
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

        // Check for Changes
        this.notification.checkForChanges()

      } else {
        this.location.setValue("")
        this.state.setLocation("")
      }
      
    })

    this.subscriptions.add(this.location.valueChanges.subscribe(n=> {
      this.state.setLocation(n)
    }))
    

    // Setup Active Link
    this.subscriptions.add(this.state.subscribeTab (n => {
      this.activeLink = <string>n 
    }))

    // Setup Notification
    this.subscriptions.add(this.state.subscribeChangeLog ((n:any) => {

      // Count Log Changes & Display
      const cnt = Object.values(n.data).reduce((a: number, n: any) => a + (n.type==="change"?1:0),0)
      this.newNotifications = cnt

    }))

    // Setup Timer to Check for Notifications (10 Minutes?)
    this.notificationTimerId = setInterval(()=>this.notification.checkForChanges(), 600000)

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
    this.state.clearChangeLog()
  }

  showNewNotifications() {

    // Force Refresh
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate(['/','posts','new-requests'], {state: {request : 'notifications'}});
    });
  
  }


  // Cleanup Subscriptions & Timers
  ngOnDestroy() {
    if (this.subscriptions) this.subscriptions.unsubscribe()
    if (this.notificationTimerId) clearInterval(this.notificationTimerId)
  }
 
}
