import { Component, Pipe, PipeTransform } from "@angular/core";


@Component({

  selector: "profile",

  template: `
  
  <mat-card>
    <mat-card-header>

      <div mat-card-avatar>User</div>
      <mat-card-title>{{user.name}}</mat-card-title>
      <mat-card-subtitle>{{user.username}}</mat-card-subtitle>

    </mat-card-header>

    <mat-card-content class="cardtext">
      <p>Addess: {{user | formatAddress}}</p>
      <p>Phone: {{user.phone}}</p>
      <p>Email: {{user.email}}</p>
    </mat-card-content>

  </mat-card>
  `,
  styles: [".cardtext {margin:20px}",
           ".cardtext {margin-left:60px}"]

})
export class AccountProfile {

  user ={
    "username": "Bipin",
    "name": "Bipin Regimi",
    "address": "6210 Stambaugh Road",
    "city": "Burlington",
    "state": "IA",
    "zip": 52601,
    "phone": "048-739-8093",
    "email": "bregmi@miu.edu",
  }

}

@Pipe({
  name: "formatAddress"
})
export class FormatAddress implements PipeTransform{

  transform (n : any) {
    return n.address + " " + n.city + " " + n.state + " " + n.zip
  }

}

