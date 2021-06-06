import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AccountLogin } from "./account-login-component";
import { AccountUpsert, CustomInput } from "./account-upsert/account-upsert-component";

import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatCardModule} from '@angular/material/card';

import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { UserIntercepter } from "../http-interceptor";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { UserHttp } from "./account-http-service";
import { AccountProfile, FormatAddress } from "./account-profile-component";





const routes: Routes = [

  {path: "login", component: AccountLogin},
  {path: "createaccount", component: AccountUpsert},
  {path: "editaccount", component: AccountUpsert},
  {path: "profile", component: AccountProfile},
  {path: "**", redirectTo: "login"}

]


@NgModule({

  declarations: [
    AccountLogin,
    AccountUpsert,
    CustomInput,
    AccountProfile,
    FormatAddress
  ],

  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule
 
  ],

  providers: [
    UserHttp,
    // { provide: HTTP_INTERCEPTORS, useClass: UserIntercepter }
    // { provide: HTTP_INTERCEPTORS, useClass: UserIntercepter , multi: true }

    
    ],
  // bootstrap: [AccountLogin]

})
export class AccountsModule{}