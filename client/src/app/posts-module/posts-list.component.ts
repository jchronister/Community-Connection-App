import { HttpClient } from '@angular/common/http';
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
  styles: [],
})
export class PostsListComponent implements OnInit {
  posts: Array<IPosts> = [];
  inputValue: string = '';
  type: string = '';

  constructor(
    private myService: MainServiceService,
    private state: AccountState,
    public router: Router
  ) {
    let x = this.router.getCurrentNavigation();
    debugger
    this.type = this.router.getCurrentNavigation()!.extras.state!.request;
  } //FIXME: have to fix the error

  onKey(e: Event) {
    this.inputValue = (<HTMLInputElement>e.target).value;
  }

  addComment(post:IPosts) {
    if (!this.inputValue) {
      return;
    }
    let comment : IComments = {
      comment: this.inputValue,
      user: this.state.getCurrentUserInfo(),
      date: new Date(),
    };


    this.myService.sendComment(comment).subscribe((data: IServerObject) => {
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
    }

    if (this.type === 'service-providers') {
      this.myService.getServiceProviders().subscribe((data) => {
        if (data.status === 'Success') {
          this.posts = data.data;
        }
      });
    }
    this.myService.getPosts().subscribe((data) => {
      if (data.status === 'Success') {
        this.posts = data.data;
      }
    });
  }
}
