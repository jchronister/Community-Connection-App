import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



// Styles
import {MatTabsModule} from '@angular/material/tabs';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AccountState } from './account-state';
import {MatToolbarModule} from '@angular/material/toolbar';
import { UserIntercepter } from './http-interceptor';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTabsModule,
    HttpClientModule,
    MatToolbarModule
  ],
  providers: [AccountState,
    { provide: HTTP_INTERCEPTORS, useClass: UserIntercepter , multi: true }
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
