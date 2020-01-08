
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { tap, catchError } from 'rxjs/operators';
import { Session } from '../models/Session';
import { GoogleUser } from '../models/google-user';
import { ServiceUtils } from './serviceUtils';

@Injectable()
export class AuthService {

  private currentUserSubject: BehaviorSubject<Session>;
  public currentUser: Observable<Session>;
  private sessionKey = 'session';
  private sessionUrl = environment.server_url + 'session';
  private sessionGoogleUrl = environment.server_url + 'session-google';


  constructor(private storage: Storage, public httpUtils: ServiceUtils) {
    if (this.currentUserSubject == null)
      this.currentUserSubject = new BehaviorSubject<Session>(null);

    this.storage.get(this.sessionKey).then(session => this.currentUserSubject.next(session));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): Session {
    return this.currentUserSubject.value;
  }


  login(email, password) {

    return this.httpUtils.http.post<Session>(`${this.sessionUrl}/`, { email: email, password: password }, this.httpUtils.httpOptions).pipe(
      tap(data => {
        this.storage.set(this.sessionKey, data).then(session => this.currentUserSubject.next(session));
      }
      ),
      catchError(this.httpUtils.handleError<Session>('login')));
  }

  loginGoogle(googleUser: GoogleUser) {
    return this.httpUtils.http.post<Session>(`${this.sessionGoogleUrl}/`, googleUser, this.httpUtils.httpOptions).pipe(
      tap(data => {
        this.storage.set(this.sessionKey, data).then(session => this.currentUserSubject.next(session));
      }
      ),
      catchError(this.httpUtils.handleError<Session>('login')));
  }

  logout() {
    return this.storage.remove(this.sessionKey).then(() => {
      this.currentUserSubject.next(null);
    });
  }

}