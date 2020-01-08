import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs/Observable';
import { catchError, tap } from 'rxjs/operators';
import { Lov } from '../models/lov';
import storeCategory from './lov-store-category';
import { ServiceUtils } from './serviceUtils';
import city from './lov-city';

@Injectable()
export class LovService {

	private lovUrl = environment.server_url + 'lov';

	constructor(private utils: ServiceUtils) { }

	shoppingList(): Observable<Lov[]> {
		let url = `${this.lovUrl}/shopping-list`;

		return this.utils.http.get<Lov[]>(url, this.utils.httpOptions).pipe(
			tap(_ => { }),
			catchError(this.utils.handleError<Lov[]>('shoppingList'))
		);
	}

	store(): Observable<Lov[]> {
		let url = `${this.lovUrl}/store`;

		return this.utils.http.get<Lov[]>(url, this.utils.httpOptions).pipe(
			tap(_ => { }),
			catchError(this.utils.handleError<Lov[]>('store'))
		);
	}

	storeCity(): Observable<Lov[]> {
		let url = `${this.lovUrl}/store-city`;

		return this.utils.http.get<Lov[]>(url, this.utils.httpOptions).pipe(
			tap(_ => { }),
			catchError(this.utils.handleError<Lov[]>('store'))
		);
	}

	storeCategory(): Lov[] {
		return storeCategory;
	}

	state(): Lov[] {
		let lov: Lov[] =
			[
				{ text: 'AC', _id: '' },
				{ text: 'AL', _id: '' },
				{ text: 'AP', _id: '' },
				{ text: 'AM', _id: '' },
				{ text: 'BA', _id: '' },
				{ text: 'CE', _id: '' },
				{ text: 'DF', _id: '' },
				{ text: 'ES', _id: '' },
				{ text: 'GO', _id: '' },
				{ text: 'MA', _id: '' },
				{ text: 'MT', _id: '' },
				{ text: 'MS', _id: '' },
				{ text: 'MG', _id: '' },
				{ text: 'PA', _id: '' },
				{ text: 'PB', _id: '' },
				{ text: 'PR', _id: '' },
				{ text: 'PE', _id: '' },
				{ text: 'PI', _id: '' },
				{ text: 'RJ', _id: '' },
				{ text: 'RN', _id: '' },
				{ text: 'RS', _id: '' },
				{ text: 'RO', _id: '' },
				{ text: 'RR', _id: '' },
				{ text: 'SC', _id: '' },
				{ text: 'SP', _id: '' },
				{ text: 'SE', _id: '' },
				{ text: 'TO', _id: '' },
			];

		return lov;

	}

	city(state: string): Lov[] {
		return city.filter((value) => { return value._id === state; });
	}
}
