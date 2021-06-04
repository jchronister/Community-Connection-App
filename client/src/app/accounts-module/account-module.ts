import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AccountLogin } from "./account-login";
import { AccountUpsert } from "./account-upsert/account-upsert";

import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';

import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { UserIntercepter } from "../http-interceptor";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { UserHttp } from "./account-http";





const routes: Routes = [

  {path: "login", component: AccountLogin},
  {path: "createaccount", component: AccountUpsert},
  {path: "editaccount", component: AccountUpsert},
  {path: "**", redirectTo: "login"}

]


@NgModule({

  declarations: [
    AccountLogin,
    AccountUpsert
  ],

  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
 
  ],

  providers: [
    UserHttp,
    // { provide: HTTP_INTERCEPTORS, useClass: UserIntercepter }
    // { provide: HTTP_INTERCEPTORS, useClass: UserIntercepter , multi: true }

    
    ],
  bootstrap: [AccountLogin]

})
export class AccountsModule{}