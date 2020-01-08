import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';

@Injectable()
export class MyToast {

	constructor(private toastCtrl: ToastController) {
	}

	show(message: string) {
		let toast = this.toastCtrl.create({
			message: message,
			cssClass: 'mytoast',
			duration: 2000
		});
		toast.present(toast);
	}

}
