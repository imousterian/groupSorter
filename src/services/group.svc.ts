import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';

export class Group {
  id: number;
  users: number[];
}

@Injectable()
export class GroupService {

  constructor(private http: Http) {
  }

  public getAll(): Promise<Group[]> {
    let resourceUrl: string = 'http://localhost:8080/api/groups';
    return this.http
      .get(resourceUrl)
      .toPromise()
      .then(response => {
          return response.json() as Group[];
      })
      .catch(err => {
          return this.handleError(err);
      })
  }

  public createGroup(payload: any): Promise<Group> {
    let resourceUrl: string = 'http://localhost:8080/api/group';
    return this.http
      .post(resourceUrl, payload)
      .toPromise()
      .then(response => {
          return response.json() as Group;
      })
      .catch(err => {
          return this.handleError(err);
      })
  }

  public updateGroup(groupID: number, payload: any): Promise<Group> {
    let resourceUrl: string = 'http://localhost:8080/api/groups/'+groupID;
    return this.http
      .put(resourceUrl, payload)
      .toPromise()
      .then(response => {
          return response.json() as Group;
      })
      .catch(err => {
          return this.handleError(err);
      })
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
}
