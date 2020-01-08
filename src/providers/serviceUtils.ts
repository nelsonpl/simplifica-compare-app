import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Injectable } from '@angular/core';

@Injectable()
export class ServiceUtils {
	public httpOptions = {
		headers: new HttpHeaders({ 'Content-Type': 'application/json' })
	};

	constructor(public http: HttpClient) { }

	public extractData(res: Response) {
		let body = res;
		return body || {};
	}

	/**
	  * Handle Http operation that failed.
	  * Let the app continue.
	  * @param operation - name of the operation that failed
	  * @param result - optional value to return as the observable result
	  */
	 public handleError<T>(operation = 'operation', result?: T) {
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
		alert(`Log: ${message}`);
	}

}
