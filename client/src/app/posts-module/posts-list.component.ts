import { Component, OnInit } from '@angular/core';
import { MainServiceService } from './main-service.service';

import { IPosts, IServerObject, IComments, } from '../app.types';
import { AccountState } from '../account-state';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-posts-list',
  templateUrl: './post-list.component.html',
  styles: [

    ".request {font-size:200%; background-color:white; border:none; text-align:left;}",

    ".subtitle {margin-left:15px}",

    ".background {background-color: #edddf8 }",

    ".card {margin: 5px}",

    ".request:hover {color:purple; cursor: pointer;}",

    ".comments {margin-left:55px}",
    
    ".userNameBtn {background-color:white; color:  mediumpurple; border:none; padding:0;text-align:left; font-size:120%}",
    
    ".userNameBtn:hover{color: Black; cursor: pointer;}",

    ".addComment {margin-left:100px}",

    ".input {padding: 10px; border-radius: 5px; border-width:1px; width:200px}",
    
    ".byUserInfo {color : grey ; margin-left : 75px}"
  ],
})
export class PostsListComponent implements OnInit {
  posts: Array<IPosts> = [];
  inputValue: string = '';
  type: string = '';
  pathOptions = {first:"", prev:"", next:"", last:""}
  showComment: any = {}
  error = "";
  byUserToggle :any ={};
  guest = true;
  subscriptions: Subscription
  pageSize = 5
  links: any = {}
  totalPages = 100
  currentPage = 1

  constructor(
    private myService: MainServiceService,
    private state: AccountState,
    public router: Router
  ) {
    this.type = this.router.getCurrentNavigation()!.extras.state!.request;
    this.guest = this.state.getCurrentUserInfo().username === "guest"

    this.subscriptions = this.state.subscribeLocation(() => {this.getPosts()})
  }

  onKey(e: Event) {
    this.inputValue = (<HTMLInputElement>e.target).value;
  }
  
  toggleDisplayUser(id: string){
    
    const tgl = this.byUserToggle[id]
    this.byUserToggle[id] = tgl === undefined? true:!tgl
  }

  addComment(post: IPosts) {
    if (!this.inputValue) {
      return;
    }
    let comment: IComments = {
      comment: this.inputValue,
      user: this.state.getCurrentUserInfo(),
      date: new Date(),
    };
    

    this.myService.sendComment(<string>post._id ,comment).subscribe((data: IServerObject) => {
      if (data.status === 'Success') {
        post.comments.push(comment);
      }
    });
  }

  ngOnInit(): void {

    this.getPosts ()

  }


  getPosts (direction?: string) {

    // Clear Errors
    this.error = ""

    const location = this.state.getLocation()

    if (!location) {
      this.error = "Please Select Location"
    } else {

      const [city, state] = location.split("-")

      // Next / Previous
      let directionQuery = ""
      if (direction) {

        if (this.links[direction]) {
          directionQuery = this.links[direction] + "&"
        }

      }

      // Check for Notifications
      let strIds = ""
      if (this.type === "notifications") {

        // Get Ids
        const ids = this.state.getChangeLog().data
    
        Object.entries(ids).forEach(([key, value]:any) => {

          if (value.type === "change") {
            strIds += (strIds===""?"":"<>") + key
          }

        })

        if (strIds) strIds = "&ids=" + strIds

      }


      // Http Request
      this.myService.getRequests(directionQuery || ("items=" + this.pageSize + "&city=" + city + "&state=" + state + "&type=" + this.type + strIds)).subscribe((data: any) => {
        
        if (data && data.body.status === 'Success') {
        
          this.posts = data.body.data;

          // Read First/Next/Prev Links from Header
          const links = data.headers.get('Link')
          this.links = links ? this.myService.parseLinkHeader(<string>links) : {}

          if (this.posts.length === 0) {
            this.error = "No Valid Data"
          }
          
        }

      });
    }

  }





  // Prev / Next / Same Page
  page ($event:any) {
   
    // Set Page Item Size
    this.pageSize = $event.pageSize


    if ($event.pageIndex > $event.previousPageIndex) {

      // Move Next
      this.getPosts("next")
      this.currentPage++

    } else if ($event.pageIndex < $event.previousPageIndex){

      // Move Previous
      this.getPosts("prev")
      this.currentPage--

    } else {
      // Size Change
      this.getPosts()
    }

  } 


  showComments(id: string) {

    // Get Current Show Status
    const tgl = this.showComment[id]

    // true if undefined else Toggle Show
    this.showComment[id] = tgl === undefined ? true : !tgl

    // Add to Change Log
    this.state.addViewedToChangeLog(id)

  }

  ngAfterViewChecked() {
    const list = document.getElementsByClassName('mat-paginator-range-label');
    list[0].innerHTML = 'Page: ' + this.currentPage.toString();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe()
  }

}
