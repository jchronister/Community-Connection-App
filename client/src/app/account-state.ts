import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import jwt_decode from "jwt-decode";
import { IUser } from "./app.types";

export interface ICities {
  city: string
  state: string
  zip: number
}
 
@Injectable()
export class AccountState {

  getHost (): string {return "http://localhost:3001"}

  // Page to Display on Login
  loggedInRedirect (): Array<string> {

    // Set Active Navigation Tab
    this.setTab("help-requests")

    return ["/", "posts", "help-requests"]
  }


  locations (): Array<ICities> {return [
    {city: "FairField", state: "IA", zip: 52556},
    {city: "Burlington", state: "IA", zip: 52601},
    {city: "Ottumwa", state: "IA", zip:	52501}

  ]}

  // Active Tab
  private readonly _tab = new Subject

  setTab (route: string) {
    this._tab.next(route)
  }

  subscribeTab (fx: (value: unknown) => void) {
    return this._tab.subscribe(fx) 
 } 
    
  
  // Token
  private readonly _token = new BehaviorSubject<string>("")

  getToken (): string {
    return this._token.getValue();
  }

  setToken (token: string): void {  
    this._token.next(token)
  }
  
  subscribeToken (fx: (value: string) => void) {
     return this._token.subscribe(fx) 
  }

  // Returns Current User Token Info
  getCurrentUserInfo (): IUser {

    const token = this.getToken()

    const data: any = token ? jwt_decode(this.getToken()) : {}

    const retrn = ["_id", "username", "name", "address", "city", "state", "zip", "phone", "email"]
      .reduce((a, n) => ({...a, [n]: data[n] || null}), {})

    return <IUser>retrn
  }

  // Nested Object Getter
  getProperty (path: string, object: any, splitChr = "."): any {

    return path.split(splitChr).reduce((a, n) => a && a[n], object)
  
  }






  
 

}