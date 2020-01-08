import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { ProductIndicationService } from '../../providers/product-indication-service-rest';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { ProductIndicationFilters } from '../../models/product-indication-filters';
import { Product } from '../../models/product';
import { AuthService } from '../../providers/auth-service-rest';
import { environment } from '../../environments/environment';
import { MyLocationService } from '../../providers/my-location-service';

@IonicPage({
	name: 'page-product-indication-list',
	segment: 'product-indication-list'
})

@Component({
	selector: 'page-product-indication-list',
	templateUrl: 'product-indication-list.html'
})
export class ProductIndicationListPage implements OnInit {

	private page = 1;
	private complete: () => void;
	private filters: ProductIndicationFilters = new ProductIndicationFilters();
	public filterCtrl: FormControl;
	public isSearching: any = false;
	public items: Array<any>;
	public isAuth = false;
	public apiUrl = environment.server_url;
	public isNotItems: boolean = false;

	constructor(private myLocationService: MyLocationService, private navCtrl: NavController, private service: ProductIndicationService, private authService: AuthService) {
		this.filterCtrl = new FormControl();
	}

	ngOnInit() {
		this.buildList();

		this.filterCtrl.valueChanges
			.pipe(debounceTime(700))
			.subscribe(search => {
				this.isSearching = false;
				this.filters.filter = search;
				this.buildList();
			});
		this.isAuth = this.authService.currentUserValue != null;
	}

	// methods start
	private async getItems() {
		this.isSearching = true;

		const myLocation = await this.myLocationService.get();

		if (this.filters == null)
			this.filters = new ProductIndicationFilters();

		if (myLocation)
			this.filters.storeCity = myLocation;

		this.filters.status = 1;

		this.service.findAll(this.page, this.filters)
			.subscribe((items: Product[]) => {
				this.items = this.items.concat(items);

				this.isNotItems = this.items.length == 0;

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

	private getDefaultImg(): string {
		return './assets/img/no-image/default.png';
	}

	// methods end

	// events start
	infinite(event) {
		this.complete = () => { event.complete(); };
		this.getItems();
	}

	openItemDetail(item) {
		this.navCtrl.push('page-product-indication-detail', { 'id': item._id });
	}

	refresh(event) {
		this.page = 1;
		this.items = [];
		this.filters = new ProductIndicationFilters();
		this.complete = () => { event.complete(); };
		this.filterCtrl.setValue('');
	}

	searching() {
		this.isSearching = true;
	}

	productImg(product: Product): string {
		if (product.image)
			return `${this.apiUrl}storage/product-indication/${product.image}`;

		return this.getDefaultImg();
	}

	defaultImg(event): void {
		const target = event.target;
		target.src = this.getDefaultImg();
	}

	redirectAdd() {
		this.navCtrl.push('page-product-indication-create');
	}

	openHome() {
		this.navCtrl.push('page-home');
	}

	openNearby() {
		this.navCtrl.push('page-nearby');
	}

	openStoreListPage() {
		this.navCtrl.push('page-store-list');
	}

	openProducts() {
		this.navCtrl.push('page-products-list');
	}

	// events end

}
