import { Component, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { IComments, IUser, newIUser } from '../app.types';
import { MainServiceService } from './main-service.service';


@Component({
  selector: 'app-comments',
  template: `

  <div class="comment">
  <div class="text desc">{{comment.comment}}</div>
  <div class="text"> <button class ="userBtn" (click)="displayProfile(comment.user._id)">{{comment.user.username}}</button> on {{comment.date | date: "M/d/yy h:mm a"}}</div>
  
  <div class ="userInfo" *ngIf="showCommentUser">
    <div>Name : {{comment.user.name}}</div>
    <div>Address : {{comment.user.address}}</div>
    <div>City : {{comment.user.city}}</div>
    <div>State : {{comment.user.state}}</div>
    <div>ZipCode : {{comment.user.zip}}</div>
    <div>Phone : {{comment.user.phone}}</div>
    <div>Email : {{comment.user.email}}</div>
  </div>
    
  </div>
  <br>
  `,
  styles: [".comment {margin: 20px;display: inline-block}",
           ".comment {background-color: #edddf8;}",
           ".comment {padding: 20px;}",
           ".comment {border-radius: 25px;}",
           ".text {color: black; padding: 5px}",
           ".desc {font-size: 150%;}",
           ".userInfo {color: grey}",
           ".userBtn:hover {background-color : BlueViolet; cursor: pointer;}",
           ".userBtn {background-color:MediumOrchid;color :white; border:none; padding :4px 15px; border-radius :8%}",
          

          ],
})
export class CommentsComponent implements OnInit {
  @Input() comment : IComments
  
  showCommentUser : boolean =false;


  newComment : FormControl= new FormControl('',Validators.required)
  constructor(private myService: MainServiceService) {

    this.comment = {
      comment: "",
      user: newIUser(),
      date: "",
    }

  }
  
  displayProfile(id: string){
    this.showCommentUser = !this.showCommentUser
  }

  ngOnInit(): void {}
}
