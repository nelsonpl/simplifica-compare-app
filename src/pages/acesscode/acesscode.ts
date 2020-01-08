import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { AccesscodeService } from '../../providers/accesscode-service-rest';

@IonicPage({
	name: 'page-acesscode',
	segment: 'acesscode'
})

@Component({
	selector: 'page-acesscode',
	templateUrl: 'acesscode.html',
})

export class AcesscodePage {

	accesscode = '';
	email = '';
	password = '';
	confirmPassword = '';

	constructor(private accesscodeService: AccesscodeService, private navCtrl: NavController, private toastCtrl: ToastController) {
	}

	onValid() {
		if (this.email.trim() == '') {
			this.alert('Informe o e-mail');
			return;
		}

		if (this.accesscode.trim() == '') {
			this.alert('Informe o código de acesso');
			return;
		}

		if (this.password == '') {
			this.alert('Informe a senha');
			return;
		}

		if (this.password.length < 6) {
			this.alert('A senha deve ter 6 (seis) ou mais caracteres');
			return;
		}

		if (this.password != this.confirmPassword) {
			this.alert('Confirme a senha');
			return;
		}

		this.accesscodeService.newPassword(this.email, this.accesscode, this.password).subscribe(data => {
			if (data) {
				this.alert('Senha resetada com sucesso!');
				this.navCtrl.setRoot('page-auth');
			}
		});;
	}

	private alert(message) {
		let toast = this.toastCtrl.create({
			message: message,
			duration: 3000,
			position: 'top',
			cssClass: 'dark-trans',
			closeButtonText: 'OK',
			showCloseButton: true
		});
		toast.present();
	}
}
