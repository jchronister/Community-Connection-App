import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AccountState } from "../account-state"
import { MainServiceService } from "./main-service.service"

@Component({

  selector: "create-post",
  template: `

    <div style="margin: 40px;">
    <h2>Please Complete Form to Create a Help or Service Request</h2>

    <form [formGroup]="requestForm" (ngSubmit)="createRequest()">

      <div>
        <mat-form-field appearance="fill">
          <mat-label>Request Type</mat-label>
          <mat-select [formControl]="type">
            <mat-option value="Help Request">Help Request</mat-option>
            <mat-option value="Service Provider">Service Provider</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <div>
        <mat-form-field appearance="fill" style="width: 500px;">
          <mat-label>Help or Service Request Text</mat-label>
          <textarea 
            cdkTextareaAutosize
            cdkAutosizeMinRows="5"
            matInput [formControl]="description"></textarea>
        </mat-form-field>
      </div>

      <button 
        [disabled]="!requestForm.valid"
        mat-raised-button color="primary">
        Create Request</button>
      
    </form>
    </div>
  `
,styles:[".txt {width: 300px}"]

})
export class CreatePost{

  requestForm: FormGroup
  type: FormControl
  description: FormControl

  constructor (private state: AccountState, private http: MainServiceService) {

    // Setup Form
    this.type = new FormControl("", Validators.required)
    this.description = new FormControl("", Validators.required)
    
    this.requestForm = new FormGroup({

      type: this.type,
      description: this.description

    })

  }


  createRequest () {

    const requestData = {
      ...this.requestForm.value,
      user: this.state.getCurrentUserInfo(),
      date: new Date()
    }
  

    // this.http.createPost(requestData).subscribe ( n => {

    //   if (n.status === "Success") {



    //   }

    // })

    // createPost(postData) : Observable <IServerObject>{
    //   return this.http.post<IServerObject>(this.url + '/api/v1/CS569FP/posts', postData);
    // }



  }

}