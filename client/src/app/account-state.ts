import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from 'rxjs';
import jwt_decode from "jwt-decode";

export interface ICities {
  city: string
  state: string
  zip: number
}
 
@Injectable()
export class AccountState {

  getHost (): string {return "http://localhost:3001"}

  loggedInRedirect (): Array<string> {return ["/", "posts", "help-requests"]}

  locations (): Array<ICities> {return [
    {city: "FairField", state: "IA", zip: 52556},
    {city: "Burlington", state: "IA", zip: 52601},
    {city: "Ottumwa", state: "IA", zip:	52501}

  ]}

    
  

  private readonly _token = new BehaviorSubject<string>("")

  getToken (): string {
    return this._token.getValue();
  }

  setToken (token: string): void {
    this._token.next(token)
  }
  
  subscribeToken (fx: (val: string)=>{}) {
     return this._token.subscribe(fx) 
  }

  getCurrentUserInfo () {

    const token = this.getToken()
    return token ? jwt_decode(this.getToken()) : {}

  }









  
 

}