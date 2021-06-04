import { HttpHandler, HttpInterceptor, HttpRequest, HttpEvent, HttpErrorResponse, HttpEventType } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { AccountState } from "./account-state";
import { map, catchError, tap } from 'rxjs/operators';
import { ngfactoryFilePath } from "@angular/compiler/src/aot/util";

@Injectable({providedIn: "root"})
export class UserIntercepter implements HttpInterceptor {

  constructor (private state: AccountState) {}

  intercept (req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // const token = this.state.getToken()
    // const cloneReq = req.clone({headers: req.headers.set("authorization", token)})
    return next.handle(req)
    // return next.handle(cloneReq).pipe(

    
//       // map(n=>{
//       //   debugger
//       //  return n
        
//       // }),
//       catchError((error, obs)=>{
// debugger
//         // Subscribe to Errors
//         this.state.getState("errors").next("Http Error: " + error.error.error)

//         return new Observable<HttpEvent<any>>();
//         // return throwError(obs)
//       })

//    )

    }

}