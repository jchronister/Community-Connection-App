import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountState } from '../account-state';

import { IUser, IPosts, IServerObject, IComments } from '../app.types';

@Injectable({
  providedIn: 'root',
})
export class MainServiceService {
  url: string = '';

  constructor(private http: HttpClient, private state: AccountState) {
    this.url = this.state.getHost();
  }

  sendComment(id: string,comment: IComments): Observable<IServerObject> {
    return this.http.put<IServerObject>(
      this.url + `/api/v1/CS569FP/posts/${id}/comments`,
      comment
    );
  }

  getPosts(): Observable<IServerObject> {
    return this.http.get<IServerObject>(this.url + '/api/v1/CS569FP/posts');
  }

  getHelpRequests(): Observable<IServerObject> {
    return this.http.get<IServerObject>(
      this.url + '/api/v1/CS569FP/posts/help-requests'
    );
  }

  getServiceProviders(): Observable<IServerObject> {
    return this.http.get<IServerObject>(
      this.url + '/api/v1/CS569FP/posts/service-providers'
    );
  }

  newHelpRequest(helpRequestPost: IPosts): Observable<IServerObject> {
    return this.http.post<IServerObject>(
      this.url + '/api/v1/CS569FP/posts/help-requests',
      helpRequestPost
    );
  }

  newServiceProvider(serviceProviderPost: IPosts): Observable<IServerObject> {
    return this.http.post<IServerObject>(
      this.url + '/api/v1/CS569FP/posts/service-providers',
      serviceProviderPost
    );
  }
}
