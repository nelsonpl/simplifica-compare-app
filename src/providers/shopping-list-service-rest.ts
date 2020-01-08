import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map, catchError, tap } from 'rxjs/operators';
import { ShoppingList } from '../models/shoppingList';
import { of } from 'rxjs/observable/of';
import { ShoppingListFilters } from '../models/shoppingList-filters';


@Injectable()
export class ShoppingListService {
	private shoppingListUrl = environment.server_url + 'shopping-list';

	private httpOptions = {
		headers: new HttpHeaders({ 'Content-Type': 'application/json' })
	};

	constructor(private http: HttpClient) { }

	// get start
	findAll(filters?: ShoppingListFilters) {
		let url = `${this.shoppingListUrl}?`;

		if (filters) {
			for (var key in filters) {
				url += "&" + key + "=" + filters[key];
			}

		}
		return this.http.get(url, this.httpOptions).pipe(
			map(this.extractData),
			catchError(this.handleError('findAll'))
		);
	}

	get(id) {
		return this.http.get<ShoppingList>(`${this.shoppingListUrl}/${id}`).pipe(
			tap(_ => { }, catchError)
		);
	}
	// get end

	// post/put/delete start
	save(shopping: ShoppingList) {
		if (shopping._id)
			return this.update(shopping);

		return this.create(shopping);
	}

	updateAddProduct(shoppingListId, productId) {
		return this.http.post(`${this.shoppingListUrl}/${shoppingListId}/${productId}`, this.httpOptions).pipe(
			tap(data => { }),
			catchError(this.handleError('updateAddProduct'))
		);
	}

	private update(shopping: ShoppingList) {
		return this.http.put(`${this.shoppingListUrl}/${shopping._id}`, shopping, this.httpOptions).pipe(
			tap(data => { }),
			catchError(this.handleError('update'))
		);
	}

	private create(shopping: ShoppingList) {
		return this.http.post(this.shoppingListUrl, shopping, this.httpOptions).pipe(
			tap(data => { }),
			catchError(this.handleError('create'))
		);
	}

	createAddOneProduct(listName, productId) {
		const entity = { title: listName, products: [productId] };
		return this.http.post(this.shoppingListUrl, entity, this.httpOptions).pipe(
			tap(data => { }),
			catchError(this.handleError('createAddOneProduct'))
		);
	}

	remove(id) {
		return this.http.delete(`${this.shoppingListUrl}/${id}`, this.httpOptions).pipe(
			tap(data => { }),
			catchError(this.handleError('remove'))
		);
	}

	// post/put end

	private extractData(res: Response) {
		let body = res;
		return body || {};
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
		alert(`Lista de Compras: ${message}`);
	}

}
