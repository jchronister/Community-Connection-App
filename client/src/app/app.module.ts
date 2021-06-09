import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSelectModule} from '@angular/material/select';


// Styles
import {MatTabsModule} from '@angular/material/tabs';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AccountState } from './account-state';
import {MatToolbarModule} from '@angular/material/toolbar';
import { UserIntercepter } from './http-interceptor';
import { ReactiveFormsModule } from '@angular/forms';
import {MatBadgeModule} from '@angular/material/badge';

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
    MatToolbarModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatBadgeModule
  ],
  providers: [AccountState,
    { provide: HTTP_INTERCEPTORS, useClass: UserIntercepter , multi: true }
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
