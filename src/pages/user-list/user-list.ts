import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, ModalController } from 'ionic-angular';
import { UserService } from '../../providers/user-service-rest';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { User } from '../../models/user';
import { AuthService } from '../../providers/auth-service-rest';
import { environment } from '../../environments/environment';

@IonicPage({
	name: 'page-user-list',
	segment: 'user-list'
})

@Component({
	selector: 'page-user-list',
	templateUrl: 'user-list.html'
})
export class UserListPage implements OnInit {

	private page = 1;
	private complete: () => void;
	private filters: string = '';
	public apiUrl = environment.server_url;
	public filterCtrl: FormControl;
	public isSearching: any = false;
	public items: Array<any>;
	public isAuth = false;

	constructor(private navCtrl: NavController, private modalCtrl: ModalController, private userService: UserService, private authService: AuthService) {
		this.filterCtrl = new FormControl();
	}

	ionViewCanEnter() {
		if (this.authService.currentUserValue == null)
			setTimeout(() => { this.navCtrl.goToRoot({}); }, 200);
		return this.authService.currentUserValue != null;
	}

	ngOnInit() {

		this.filterCtrl.valueChanges
			.pipe(debounceTime(700))
			.subscribe(search => {
				this.isSearching = false;
				this.filters = search;
				this.buildList();
			});
	}

	ionViewWillEnter() {
		this.buildList();
		this.isAuth = this.authService.currentUserValue != null;
	}

	// methods start
	private getItems(): void {
		this.isSearching = true;
		this.userService.findAll(this.page, this.filters)
			.subscribe((items: User[]) => {
				this.items = this.items.concat(items);
				if (items.length) {
					this.page++;
				}
				if (this.complete) {
					this.complete();
					this.complete = null;
				}
				this.isSearching = false;
			});
	}

	private buildList() {
		this.page = 1;
		this.items = [];
		this.getItems();
	}
	// methods end

	// events start
	onInfinite(event) {
		this.complete = () => { event.complete(); };
		this.getItems();
	}

	onOpenItemDetail(item) {
		this.navCtrl.push('page-user-detail', { 'id': item._id });
	}

	onRefresh(event) {
		this.page = 1;
		this.items = [];
		this.complete = () => { event.complete(); };
		this.filterCtrl.setValue('');
	}

	onSearching() {
		this.isSearching = true;
	}

	onOpenFilter() {
		let modal = this.modalCtrl.create('page-user-filter');
		modal.present();
		modal.onDidDismiss(data => {
			this.filters = data;
			this.buildList();
			this.isSearching = false;
		});

	}
	// events end

}
