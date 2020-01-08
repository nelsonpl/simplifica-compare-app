import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { catchError, tap } from 'rxjs/operators';
import { ServiceUtils } from './serviceUtils';
import { Store } from '../models/store';


@Injectable()
export class ComparationService {
	private comparationUrl = environment.server_url + 'comparation';

	constructor(private utils: ServiceUtils) { }

	// get start
	get(shoppingId: string) {
		return this.utils.http.get<Store[]>(`${this.comparationUrl}/${shoppingId}`, this.utils.httpOptions).pipe(
			tap(_ => { }, catchError)
		);
	}
	// get end

}
