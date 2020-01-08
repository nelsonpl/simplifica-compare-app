
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { ServiceUtils } from './serviceUtils';
import { NotificationToken } from '../models/notification-token';
import { tap, catchError } from 'rxjs/operators';

@Injectable()
export class NotificationTokenService {

  private userUrl = environment.server_url + 'notification-token';

  constructor(private utils: ServiceUtils) { }

  create(token: NotificationToken) {
    return this.utils.http.post(this.userUrl, token, this.utils.httpOptions).pipe(
      tap(_ => {  }),
      catchError(this.utils.handleError('createUser')
      ));
  }
}
