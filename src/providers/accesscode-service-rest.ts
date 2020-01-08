
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { tap, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of } from 'rxjs/observable/of';
import { User } from '../models/user';
import { Observable } from 'rxjs';

@Injectable()
export class AccesscodeService {
  new(data: any) {
    throw new Error("Method not implemented.");
  }

  private accesscodeUrl = environment.server_url + 'accesscode';

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  newPassword(email, accesscode, password) {
    return this.http.put(`${this.accesscodeUrl}/${email}/${accesscode}/${password}`, this.httpOptions).pipe(
      tap((newUser: User) => { }/*this.log(`added user w/ id=${newUser._id}`)*/),
      catchError(this.handleError('valid'))
    );
  }

  newCode(email) {
    return this.http.post(`${this.accesscodeUrl}/${email}`, this.httpOptions).pipe(
      tap((newUser: User) => { }/*this.log(`added user w/ id=${newUser._id}`)*/),
      catchError(this.handleError('valid'))
    );
  }

  /**
    * Handle Http operation that failed.
    * Let the app continue.
    * @param operation - name of the operation that failed
    * @param result - optional value to return as the observable result
    */
  private handleError<T>(operation = 'operation', result?: T) {
    return (data: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(data); // log to console instead

      // TODO: better job of transforming error for user consumption
      if (data.error.message)
        this.log(data.error.message);
      else
        this.log(`${operation} failed: ${data.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    // this.messageService.add(`HeroService: ${message}`);
    alert(`Autenticação: ${message}`);
  }

}