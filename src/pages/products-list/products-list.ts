import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, ModalController } from 'ionic-angular';
import { ProductService } from '../../providers/product-service-rest';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { ProductFilters } from '../../models/product-filters';
import { Product } from '../../models/product';
import { AuthService } from '../../providers/auth-service-rest';
import { environment } from '../../environments/environment';
import { MyLocationService } from '../../providers/my-location-service';

@IonicPage({
	name: 'page-products-list',
	segment: 'dish-list'
})

@Component({
	selector: 'page-products-list',
	templateUrl: 'products-list.html'
})
export class ProductsListPage implements OnInit {

	private page = 1;
	private complete: () => void;
	private filters: ProductFilters = new ProductFilters();
	public filterCtrl: FormControl;
	public isSearching: any = false;
	public items: Array<any>;
	public isAuth = false;
	public apiUrl = environment.server_url;
	public isNotItems: boolean = false;

	constructor(private myLocationService: MyLocationService, private navCtrl: NavController, private modalCtrl: ModalController, private productService: ProductService, private authService: AuthService) {
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
			this.filters = new ProductFilters();

		if (myLocation)
			this.filters.storeCity = myLocation;

		this.productService.findAll(this.page, this.filters)
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
	// methods end

	// events start
	onInfinite(event) {
		this.complete = () => { event.complete(); };
		this.getItems();
	}

	onOpenItemDetail(item) {
		this.navCtrl.push('page-products-detail', { 'id': item._id });
	}

	onRefresh(event) {
		this.page = 1;
		this.items = [];
		this.filters = new ProductFilters();
		this.complete = () => { event.complete(); };
		this.filterCtrl.setValue('');
	}

	onSearching() {
		this.isSearching = true;
	}

	onCancel(event) {

	}

	onOpenFilter() {
		let modal = this.modalCtrl.create('page-products-filter');
		modal.present();
		modal.onDidDismiss(data => {
			this.filters = data;
			this.buildList();
			this.isSearching = false;
		});

	}

	productImg(product: Product): string {
		if (product.image)
			return `${this.apiUrl}storage/product/${product.image}`;

		return this.getDefaultImg(product);
	}

	defaultImg(event, product: Product): void {
		const target = event.target;
		target.src = this.getDefaultImg(product);
	}

	private getDefaultImg(product: Product): string {
		if (product.store)
			switch (product.store.category) {
				case 'Posto de Combustível':
					return './assets/img/no-image/fuel.png';
			}
		return './assets/img/no-image/default.png';
	}
	// events end

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

}
