
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { tap, catchError } from 'rxjs/operators';
import { User } from '../models/user';
import { Observable } from 'rxjs';
import { ServiceUtils } from './serviceUtils';

@Injectable()
export class UserService {

  private userUrl = environment.server_url + 'user';

  constructor(private utils: ServiceUtils) { }

  create(user: User): Observable<User> {
    return this.utils.http.post<User>(this.userUrl, user, this.utils.httpOptions).pipe(
      tap(_ => { }),
      catchError(this.utils.handleError<User>('createUser')
      ));
  }

  update(user: User): Observable<User> {
    return this.utils.http.put<User>(this.userUrl, user, this.utils.httpOptions).pipe(
      tap(_ => { }),
      catchError(this.utils.handleError<User>('updateUser'))
    );
  }

  get(id) {
    return this.utils.http.get<User>(`${this.userUrl}/${id}`).pipe(
      tap(_ => { }, catchError(this.utils.handleError<User>('getUser'))
      ));
  }
}
