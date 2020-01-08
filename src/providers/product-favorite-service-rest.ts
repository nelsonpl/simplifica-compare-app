import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { map, catchError, tap } from 'rxjs/operators';
import { ServiceUtils } from './serviceUtils';

@Injectable()
export class ProductFavoriteService {

	private productUrl = environment.server_url + 'product-favorite';

	constructor(private utils: ServiceUtils) { }

	findAll() {

		return this.utils.http.get(this.productUrl).pipe(
			map(this.utils.extractData),
			catchError(this.utils.handleError('findAll'))
		);
	}

	is(productId: string) {
		return this.utils.http.get(`${this.productUrl}/${productId}`).pipe(
			map(this.utils.extractData),
			catchError(this.utils.handleError('get'))
		);
	}

	add(productId: string) {
		return this.utils.http.post(this.productUrl, { productId: productId }, this.utils.httpOptions).pipe(
			tap(data => { }),
			catchError(this.utils.handleError('create'))
		);
	}

	delete(productId: string) {
		return this.utils.http.delete(`${this.productUrl}/${productId}`, this.utils.httpOptions).pipe(
			tap(data => { }),
			catchError(this.utils.handleError('delelte'))
		);
	}
}
