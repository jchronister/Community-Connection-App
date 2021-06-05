import { Component, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { IComments, IUser } from '../app.types';


@Component({
  selector: 'app-comments',
  templateUrl: "./comments.component.html",
  styles: [],
})
export class CommentsComponent implements OnInit {
  @Input()
  comment : any
   
  newComment : FormControl= new FormControl('',Validators.required)
  constructor() {}

  ngOnInit(): void {}
}
