import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MainServiceService } from './main-service.service';

import { IUser, IPosts, IServerObject, IComments, newIPosts } from '../app.types';
import { Observable } from 'rxjs';
import { AccountState } from '../account-state';
import { Router } from '@angular/router';
import { isPlatformServer } from '@angular/common';

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

    this.myService.getRequests(this.type).subscribe((data: any) => {
      
      if (data && data.body.status === 'Success') {
       
        this.posts = data.body.data;

        //   const y = n.headers.get('Link')
        //   const l = this.parseLinkHeader(<string>y)
        if (this.posts.length === 0) {
          this.error = "No Valid Data"
        }
        
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
