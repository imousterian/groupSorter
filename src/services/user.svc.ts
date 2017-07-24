import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';

export class User {
  id: number;
  name: string;
}

@Injectable()
export class UserService {

  constructor(private http: Http) {
  }

  public getAll(): Promise<User[]> {
    let resourceUrl: string = 'http://localhost:8080/api/users';
    return this.http
      .get(resourceUrl)
      .toPromise()
      .then(response => {
          return response.json() as User[];
      })
      .catch(err => {
          return this.handleError(err);
      })
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
}
