import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { map, catchError, tap } from 'rxjs/operators';
import { ProductFilters } from '../models/product-filters';
import { Product } from '../models/product';
import { ServiceUtils } from './serviceUtils';

@Injectable()
export class ProductService {

	private productUrl = environment.server_url + 'product';
	private imgUrl = environment.server_url + 'productimg';

	constructor(private utils: ServiceUtils) { }

	findAll(page = 1, filters?: ProductFilters, total?: number) {

		let url = `${this.productUrl}?page=${page}`;

		if (total)
			url += `&total=${total}`;

		if (filters) {
			for (var key in filters) {
				url += "&" + key + "=" + filters[key];
			}
		}

		return this.utils.http.get(url).pipe(
			map(this.utils.extractData),
			catchError(this.utils.handleError('findAll'))
		);
	}

	getImg(id, imgId) {
		return `${this.imgUrl}?nomearquivo=${imgId}&nomepasta=${id}`;
	}

	listHome() {
		return this.utils.http.get(`${this.productUrl}?isShowHome=1`).pipe(
			map(this.utils.extractData),
			catchError(this.utils.handleError('listHome'))
		);
	}

	get(id) {
		return this.utils.http.get<Product>(`${this.productUrl}/${id}`).pipe(
			tap(_ => { }, catchError)
		);
	}

	saveImg(productId: string, img: FormData) {
		return this.utils.http.post(this.imgUrl + '/' + productId, img);
	}

	save(product: Product) {
		if (product._id)
			return this.update(product);

		return this.create(product);
	}

	private update(product: Product) {
		return this.utils.http.put(`${this.productUrl}/${product._id}`, product, this.utils.httpOptions).pipe(
			tap(data => { }),
			catchError(this.utils.handleError('update'))
		);
	}

	private create(product: Product) {
		return this.utils.http.post(this.productUrl, product, this.utils.httpOptions).pipe(
			tap(data => { }),
			catchError(this.utils.handleError('create'))
		);
	}
}
