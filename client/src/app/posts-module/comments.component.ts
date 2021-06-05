import { Component, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { IComments, IUser } from '../app.types';


@Component({
  selector: 'app-comments',
  template: `
  <p>{{comment.user.username}}</p>
  <p>{{comment.comment}}</p>
  <p>{{comment.date}}</p>
  `,
  styles: [],
})
export class CommentsComponent implements OnInit {
  @Input() comment : any  //TODO: could not figure out how to initialize with type
   
  newComment : FormControl= new FormControl('',Validators.required)
  constructor() {}

  ngOnInit(): void {}
}
