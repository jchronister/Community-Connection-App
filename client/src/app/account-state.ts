import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import jwt_decode from 'jwt-decode';
import { IUser } from './app.types';



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


  private _location = ""
  private readonly _locationSub = new Subject();
  setLocation(location: string) {
    this._location = location
    this._locationSub.next(location)
  }

  getLocation() {
    return this._location
  }

  subscribeLocation(fx: (value: unknown) => void) {
    return this._locationSub .subscribe(fx);
  }

 
  private _notificationLog: any = {lastUpdate: new Date(0), data: {}}
  private readonly _notificationLogSub = new Subject();

  getChangeLog() {
    return this._notificationLog
  }

  setChangeLog(newLog: any) {
    this._notificationLog = newLog
    this._notificationLogSub.next(newLog)
  }

  subscribeChangeLog(fx: (value: unknown) => void) {
    return this._notificationLogSub.subscribe(fx);
  }

  clearChangeLog() {
    this._notificationLog = {lastUpdate: new Date(0), data: {}}
  }

  addViewedToChangeLog(id: string) {

    const dateNow = new Date()

    const old = this._notificationLog.data[id]

    if (old) {

      // Changed to Viewed
      old.type = "view"
      old.dateChange = dateNow

    } else {

      // Insert
      this._notificationLog = {...this._notificationLog, [id]: {date: dateNow, type: "view"}}

    }

    // Send Change
    this._notificationLogSub.next(this._notificationLog)

  }


}
