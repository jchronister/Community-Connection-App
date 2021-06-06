import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MainServiceService } from './main-service.service';

import { IUser, IPosts, IServerObject, IComments } from '../app.types';
import { Observable } from 'rxjs';
import { AccountState } from '../account-state';

@Component({
  selector: 'app-posts-list',
  templateUrl: './post-list.component.html',
  styles: [],
})
export class PostsListComponent implements OnInit {
  posts: Array<IPosts> = [];
  inputValue: string = '';
  constructor(
    private myService: MainServiceService,
    private state: AccountState
  ) {}

  onKey(e: Event) {
    this.inputValue = (<HTMLInputElement>e.target).value;
  }

  onClick() {
    if (!this.inputValue) {
      return;
    }
    let comment : IComments = {
      comment: this.inputValue,
      user: this.state.getCurrentUserInfo(),
      date: new Date(),
    };

    this.myService.sendComment(comment).subscribe((data) => {
      if (data.status === 'Success') {
        this.posts = data.data;
      }
    });
  }

  ngOnInit(): void {
    this.myService.getPosts().subscribe((data) => {
      if (data.status === 'Success') {
        this.posts = data.data;
      }
    });
  }
}
