import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MainServiceService } from './main-service.service';

import { IUser, IPosts, IServerObject, IComments } from '../app.types';
import { Observable } from 'rxjs';
import { AccountState } from '../account-state';
import { Router } from '@angular/router';
import { isPlatformServer } from '@angular/common';

@Component({
  selector: 'app-posts-list',
  templateUrl: './post-list.component.html',
  styles: [

    ".request {font-size:200%; background-color:white; border:none; text-align:left}",

    ".subtitle {margin-left:15px}",

    ".request:hover {color:red; cursor: pointer;}",

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

  constructor(
    private myService: MainServiceService,
    private state: AccountState,
    public router: Router
  ) {
    this.type = this.router.getCurrentNavigation()!.extras.state!.request;
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
 
    if (this.type === 'help-requests') {
      this.myService.getHelpRequests().subscribe((data) => {
        
        if (data.status === 'Success') {
          this.posts = data.data;
        }
      });
    } else if (this.type === 'service-providers') {
      this.myService.getServiceProviders().subscribe((data) => {
        if (data.status === 'Success') {
          this.posts = data.data;
        }
      });
    } else {
      this.myService.getPosts().subscribe((data: any) => {
        if (data.status === 'Success') {
          this.posts = data.data;
        }
      });
    }
    this.myService.getPosts().subscribe((data:any) => {
  
      if (data.body.status === 'Success') {
      

        // pipe(tap(n => {
        //   const y = n.headers.get('Link')
        //   const l = this.parseLinkHeader(<string>y)
        //   debugger
        //   console.log(n)
    
        // }))
        this.posts = data.body.data;
      }
    });
  }


  page ($event:any) {
    console.log($event)

    // getRequests

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



}
