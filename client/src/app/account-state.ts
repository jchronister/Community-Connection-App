import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from 'rxjs';


 
@Injectable()
export class AccountState {

  // Setup Root URL
  getHost (): string {
    return "http://localhost:3001"
  }

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










  
 

}