import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { map, catchError, tap } from 'rxjs/operators';
import { ServiceUtils } from './serviceUtils';
import { Message } from '../models/message';
import { Storage } from '@ionic/storage';

@Injectable()
export class MessageService {

	private messageUrl = environment.server_url + 'notification';

	constructor(private storage: Storage, private utils: ServiceUtils) { }

	getAll(page = 1, date?: Date) {

		let url = `${this.messageUrl}?page=${page}`;

		if (date)
			url += `&date=${date}`;

		return this.utils.http.get(url).pipe(
			map(this.utils.extractData),
			catchError(this.utils.handleError('findAll'))
		);
	}

	get(id) {
		return this.utils.http.get<Message>(`${this.messageUrl}/${id}`)
			.pipe(tap(_ => { }, catchError(this.utils.handleError('get'))));
	}

	getTotal() {
		return this.utils.http.get<Message>(`${this.messageUrl}/1`)
			.pipe(tap(_ => { }, catchError(this.utils.handleError('get'))));
	}

	save(message: Message) {
		if (message._id)
			return this.update(message);

		return this.create(message);
	}

	private update(message: Message) {
		return this.utils.http.put(`${this.messageUrl}/${message._id}`, message, this.utils.httpOptions).pipe(
			tap(data => { }),
			catchError(this.utils.handleError('update'))
		);
	}

	private create(message: Message) {
		return this.utils.http.post(this.messageUrl, message, this.utils.httpOptions).pipe(
			tap(data => { }),
			catchError(this.utils.handleError('create'))
		);
	}

	async getNewMsg() {
		return await this.storage.get('IS_NEW_MSG');
	}

	async setNewMsg(flag: boolean) {
		return await this.storage.set('IS_NEW_MSG', flag);
	}
}
