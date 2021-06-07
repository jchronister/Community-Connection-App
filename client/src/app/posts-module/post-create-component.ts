import { Component, OnDestroy } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { AccountState } from "../account-state"
import { IServerObject } from "../app.types";
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
export class CreatePost implements OnDestroy{

  requestForm: FormGroup
  type: FormControl
  description: FormControl
  error = ""
  subscription: Subscription | undefined

  constructor (private state: AccountState, private http: MainServiceService) {

    // Setup Form
    this.type = new FormControl("", Validators.required)
    this.description = new FormControl("", Validators.required)
    
    this.requestForm = new FormGroup({

      type: this.type,
      description: this.description

    })

    this.subscription = this.requestForm.valueChanges.subscribe ( () => this.error = "")

  }


  createRequest () {

      this.error = ""

      this.http.postRequest(this.requestForm.value).subscribe( (n: IServerObject) => {

        if (n.status === "Success") {
          alert("Request Added")
          this.requestForm.reset()     
        } else {
          this.error = "Error Adding Request: " + n.error
        }
      })
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe()
  }

}