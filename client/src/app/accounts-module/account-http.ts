import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import {Observable} from "rxjs"
import { AccountState } from "../account-state";

export interface IToken {

  active: boolean
  email: string
  fullname: string
  role: string
  _id: string

}

interface ILogin {
  password: string,
  username: string
}

interface IServerObject {

  status: "Failed" | "Success",
  data: any | null,  
  nModified: number | null,
  error : string | null
  
}


// @Injectable({providedIn: "root"})
@Injectable()
export class UserHttp {

  url = ""

  constructor (private http: HttpClient, private state: AccountState) {
    // this.url = state.getState("rootURL")
  }

  login (data: ILogin): Observable<IServerObject> {
    return this.http.post<IServerObject>(this.url + "/signin",data)
  }

  createAccount (data: ILogin): Observable<IServerObject> {
    return this.http.post<IServerObject>(this.url + "/signup",data)
  }



}