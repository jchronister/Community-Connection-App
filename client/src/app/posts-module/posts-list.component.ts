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

    ".request {font-size:200%; background-color:white; border:none; text-align:left}",

    ".subtitle {margin-left:15px}",

    ".background {background-color: #edddf8 }",

    ".card {margin: 5px}",

    ".request:hover {color:purple; cursor: pointer;}",

    ".comments {margin-left:55px}",

    ".addComment {margin-left:100px}",

    ".input {padding: 10px; border-radius: 5px; border-width:1px; width:200px}"
  ],
})
export class PostsListComponent implements OnInit {
  posts: Array<IPosts> = [];
  inputValue: string = '';
  type: string = '';
  pathOptions = {first:"", prev:"", next:"", last:""}
  showComment: any = {}
  error = ""
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

      this.myService.getRequests(directionQuery + "items=" + this.pageSize + "&city=" + city + "&state=" + state + "&type=" + this.type).subscribe((data: any) => {
       
        if (data && data.body.status === 'Success') {
        
          this.posts = data.body.data;

            const links = data.headers.get('Link')
            this.links = links ? this.myService.parseLinkHeader(<string>links) : {}

          if (this.posts.length === 0) {
            if (direction = "next") this.currentPage--
            this.error = "No Valid Data"
          }
          
        }

      });
    }

  }






  page ($event:any) {
   

    this.pageSize = $event.pageSize

    // getPosts ()
    console.log($event, this.pageSize)
    // getRequests

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

//     length: 100
// pageIndex: 4
// pageSize: 5
// previousPageIndex: 2


  } 


  showComments(id: string) {

    // Get Current Show Status
    const tgl = this.showComment[id]

    // true if undefined else Toggle Show
    this.showComment[id] = tgl === undefined ? true : !tgl

  }

  ngAfterViewChecked() {
    const list = document.getElementsByClassName('mat-paginator-range-label');
    list[0].innerHTML = 'Page: ' + this.currentPage.toString();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe()
  }

}
