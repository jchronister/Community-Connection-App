import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MainServiceService } from './main-service.service';

import { IUser, IPosts, IServerObject } from '../app.types';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-posts-list',
  templateUrl: './post-list.component.html',
  styles: [],
})
export class PostsListComponent implements OnInit {
  posts: Array<IPosts> = [];
  inputValue: string = '';
  constructor(private myService: MainServiceService) {}

  onKey(e: Event) {
   this.inputValue = (<HTMLInputElement>e.target).value;
  }
  
  onClick(){
    
  }

  ngOnInit(): void {
    this.myService.getPosts().subscribe((data) => {
      if (data.status === 'Success') {
        this.posts = data.data;
      }
    });
  }
}
