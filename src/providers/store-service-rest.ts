import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { map, catchError, tap } from 'rxjs/operators';
import { StoreFilters } from '../models/store-filters';
import { Store } from '../models/store';
import { ServiceUtils } from './serviceUtils';


@Injectable()
export class StoreService {

	private storeUrl = environment.server_url + 'store';

	constructor(private utils: ServiceUtils) { }

	findAll(page = 1, filters?: StoreFilters) {

		let url = `${this.storeUrl}?page=${page}`;

		if (filters) {
			for (var key in filters) {
				url += "&" + key + "=" + filters[key];
			}
		}

		return this.utils.http.get(url).pipe(
			map(this.utils.extractData),
			catchError(this.utils.handleError('finddAll'))
		);
	}


	listHome() {
		return this.utils.http.get(`${this.storeUrl}?isShowHome=1`).pipe(
			map(this.utils.extractData),
			catchError(this.utils.handleError('listHome'))
		);
	}

	get(id) {
		return this.utils.http.get<Store>(`${this.storeUrl}/${id}`).pipe(
			tap(_ => { }, catchError(this.utils.handleError('get')))
		);
	}


	save(store: Store) {
		if (store._id)
			return this.update(store);

		return this.create(store);
	}

	private update(store: Store) {
		return this.utils.http.put(`${this.storeUrl}/${store._id}`, store, this.utils.httpOptions).pipe(
			tap(data => { }),
			catchError(this.utils.handleError('update'))
		);
	}

	private create(store: Store) {
		return this.utils.http.post(this.storeUrl, store, this.utils.httpOptions).pipe(
			tap(data => { }),
			catchError(this.utils.handleError('create'))
		);
	}
}
