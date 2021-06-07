import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import jwt_decode from 'jwt-decode';
import { IUser } from './app.types';
import { Router } from '@angular/router';

export interface ICities {
  city: string;
  state: string;
  zip: number;
}

interface Iredirect {
  
  path:Array<string>, 
  state: {request:string}
}

@Injectable()
export class AccountState {
  getHost(): string {
    return 'http://localhost:3001';
  }

  // Page to Display on Login
  loggedInRedirect() : Iredirect {
  
    // Set Active Navigation Tab
    this.setTab('all-requests');

    return {path: ['/', 'posts', 'all-requests'],
            state: { request: 'all-requests' }
            }
    
  }

  locations(): Array<ICities> {
    return [
      { city: 'FairField', state: 'IA', zip: 52556 },
      { city: 'Burlington', state: 'IA', zip: 52601 },
      { city: 'Ottumwa', state: 'IA', zip: 52501 },
    ];
  }

  // Active Tab
  private readonly _tab = new Subject();

  setTab(route: string) {
    this._tab.next(route);
  }

  subscribeTab(fx: (value: unknown) => void) {
    return this._tab.subscribe(fx);
  }

  // Token
  // private readonly _token = new BehaviorSubject<string>('');
  private readonly _token = new Subject();
  private _tokenValue = ""

  getToken(): string {
    return this._tokenValue;
  }

  setToken(token: string): void {
    this._tokenValue = token
    this._token.next(token);
  }

  subscribeToken(fx: (value: unknown) => void) {
    return this._token.subscribe(fx);
  }

  // Returns Current User Token Info
  getCurrentUserInfo(): IUser {
    const token = this.getToken();

    const data: any = token ? jwt_decode(token) : {};

    const retrn = [
      '_id',
      'username',
      'name',
      'address',
      'city',
      'state',
      'zip',
      'phone',
      'email',
    ].reduce((a, n) => ({ ...a, [n]: data[n] || null }), {});

    return <IUser>retrn;
  }

  // Nested Object Getter
  getProperty(path: string, object: any, splitChr = '.'): any {
    return path.split(splitChr).reduce((a, n) => a && a[n], object);
  }
}
