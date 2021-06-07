import { Component, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { IComments, IUser, newIUser } from '../app.types';


@Component({
  selector: 'app-comments',
  template: `

  <div class="comment">
  <div class="text desc">{{comment.comment}}</div>
  <div class="text">{{comment.user.username}} on {{comment.date | date: "M/d/yy h:mm a"}}</div>
  </div>
  <br>
  `,
  styles: [".comment {margin: 20px;display: inline-block}",
           ".comment {background-color: grey;}",
           ".comment {padding: 20px;}",
           ".comment {border-radius: 25px;}",
           ".text {color: white; padding: 5px}",
           ".desc {font-size: 150%;}"

          ],
})
export class CommentsComponent implements OnInit {
  @Input() comment : IComments

  newComment : FormControl= new FormControl('',Validators.required)
  constructor() {

    this.comment = {
      comment: "",
      user: newIUser(),
      date: "",
    }

  }

  ngOnInit(): void {}
}
