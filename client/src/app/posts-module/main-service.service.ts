import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { tap} from 'rxjs/operators';
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

  sendComment(comment: IComments): Observable<IServerObject> {
    return this.http.put<IServerObject>(
      this.url + '/api/v1/CS569FP/posts/:id/comment',
      comment
    );
  }

  getPosts(): any {

    return this.http.get (this.url + '/api/v1/CS569FP/posts',{observe: "response"})

  }

  getHelpRequests(): Observable<IServerObject> {
    return this.http.get<IServerObject>(
      this.url + '/api/v1/CS569FP/posts/help-requests'
    );
  }

  getRequests(type?: string): Observable<IServerObject> {
    return this.http.get<IServerObject>(
      this.url + '/api/v1/CS569FP/posts/' + type
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


  // Parse Header Links into Object
  parseLinkHeader(header: string): any {

    if (header.length === 0) return 

    return header.split(',').reduce((a: any, n) => {
      let section = n.split(';');
      return {...a, [section[1].replace(/rel="(.*)"/, '$1').trim()]: section[0].replace(/<(.*)>/, '$1').trim()}
    }, {})
    
  }  

}
