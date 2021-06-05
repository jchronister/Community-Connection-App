import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountState } from '../account-state';

import { IUser, IPosts, IServerObject, IComments} from '../app.types'

@Injectable({
  providedIn: 'root',
})
export class MainServiceService {
  url: string = '';

  constructor(private http: HttpClient, private state: AccountState) {
    this.url = this.state.getHost();
  }
  
  sendComment(comment:IComments): Observable<IServerObject>{
    return this.http.put<IServerObject>(this.url + '/api/v1/CS569FP/posts/:id/comment', comment)
  }

  getPosts() : Observable <IServerObject>{
    return this.http.get<IServerObject>(this.url + '/api/v1/CS569FP/posts');
  }
}
