import { Injectable } from "@angular/core";
import { Subject } from 'rxjs';


interface IState {

  errors: Subject<string>,
  rootURL: string,

}

   




@Injectable()
// @Injectable({providedIn: "root"})
export class AccountState {

  
  state = {
    errors: new Subject(),
    rootURL: "http://localhost:3001/api/v1/CS569/",
    token: ""
  }

  setState(key: string, data: any): void {
    this.state[key as keyof IState] = data
  }

  getState(key: string) {
    return this.state[key as keyof IState]
  }

  subscribe(key: string, fx: (n:any)=>void) {
    return (<Subject<unknown>>this.state[key as keyof IState]).subscribe(fx)
  }
 

}