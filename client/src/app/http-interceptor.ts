import { HttpHandler, HttpInterceptor, HttpRequest, HttpEvent, HttpErrorResponse, HttpEventType } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of, throwError } from "rxjs";
import { AccountState } from "./account-state";
import { map, catchError, tap } from 'rxjs/operators';
import { ngfactoryFilePath } from "@angular/compiler/src/aot/util";
import { IServerObject } from "./app.types"
import { analyzeAndValidateNgModules } from "@angular/compiler";

@Injectable({providedIn: "root"})
export class UserIntercepter implements HttpInterceptor {

  constructor (private state: AccountState) {}

  intercept (req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{

    const token = this.state.getToken()
    const cloneReq = req.clone({headers: req.headers.set("authorization", token)})
    return next.handle(cloneReq)
    // return next.handle(req)//.pipe(

    
//       // map(n=>{
//       //   debugger
//       //  return n
        
//       // }),
//       catchError((error, obs)=>{
// debugger
//         // Subscribe to Errors
//         // this.state.getState("errors").next("Http Error: " + error.error.error)

//         // return throwError (obs) as HttpEvent<any>;
//         // return throwError(obs)
//         return new HttpEventType<any>()
//       })

   //)/

    }

}