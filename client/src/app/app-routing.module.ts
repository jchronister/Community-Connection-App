import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  { path: "accounts", 
    loadChildren: () => import("./accounts-module/account-module").then(m => m.AccountsModule)}
  
  // ,{path: "**", redirectTo: "user"}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
