import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { IToken, UserHttp } from "../account-http";
import { passwordVerification } from "../account-module-fx";
import { AccountState } from "../../account-state";
import jwt_decode from "jwt-decode";


 



@Component({

  selector: "userUpsert",
  templateUrl: "./account-upsert.html",
  styleUrls: ["./account-upsert.css"]

})
export class AccountUpsert implements OnInit{

  upsertForm: FormGroup
  username: FormControl
  password: FormControl
  fullname: FormControl
  status: FormControl
  role: FormControl
  roles = ["user", "admin"]
  statuses = [true, false]
  submitText = "Submit"
  error = ""

  constructor (private http: UserHttp, private userState: AccountState) {

    this.username = new FormControl("", Validators.required)
    this.password = new FormControl("", [Validators.required, passwordVerification])
    this.fullname = new FormControl("", [Validators.required, this.fullNameValidator])
    this.status = new FormControl("", Validators.required)
    this.role = new FormControl("", Validators.required)

    this.upsertForm = new FormGroup({

      username: this.username,
      password: this.password,
      fullname: this.fullname,
      status: this.status,
      role: this.role

    })

    // Reset Error Message
    this.upsertForm.statusChanges.subscribe(()=>this.error="")

  }

  ngOnInit() {

    // const token = this.userState.getToken()

    // if (token) {

    //   const decoded: IToken = jwt_decode(token);
    //   this.username.setValue(decoded.email)
    //   this.fullname.setValue(decoded.fullname)
    //   this.status.setValue(decoded.active)
    //   this.role.setValue(decoded.role)

    // }

  }


  // Valid = Two Words with Space Between
  fullNameValidator (el: FormControl) {
    return el.value.split(" ")
      .reduce((a: number, n: string) => n.length? a + 1 : a, 0) > 1 ? null :
      {msg: "Invalid Full Name: Need Two Words"}
  }


  upsertSubmit () {

    console.log(this.upsertForm.value)
    this.http.createAccount(this.upsertForm.value).subscribe( n=> {
      
      if (n.status === "Success") {
        // this.userState.token = n.data
      } else {
        this.error = <string>n.error
      }
    },
    (error) => this.error = error.message
    )

  }



}


