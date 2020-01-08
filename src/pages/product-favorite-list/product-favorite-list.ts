import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { ProductFavoriteService } from '../../providers/product-favorite-service-rest';
import { Product } from '../../models/product';
import { AuthService } from '../../providers/auth-service-rest';
import { environment } from '../../environments/environment';

@IonicPage({
	name: 'page-product-favorite-list',
	segment: 'product-favorite-list'
})

@Component({
	selector: 'page-product-favorite-list',
	templateUrl: 'product-favorite-list.html'
})
export class ProductFavoriteListPage implements OnInit {

	private complete: () => void;
	public isSearching: any = false;
	public items: Array<any>;
	public apiUrl = environment.server_url;
	public isNotItems: boolean = false;

	constructor(private navCtrl: NavController, private service: ProductFavoriteService, private authService: AuthService) {
	}

	ngOnInit() {
		this.buildList();
	}

	ionViewCanEnter() {
		if (this.authService.currentUserValue == null)
			setTimeout(() => { this.navCtrl.goToRoot({}); }, 200);
		return this.authService.currentUserValue != null;
	}

	// methods start
	private async getItems() {
		this.isSearching = true;

		this.service.findAll()
			.subscribe((items: Product[]) => {
				this.items = this.items.concat(items);

				this.isNotItems = this.items.length == 0;

				if (this.complete) {
					this.complete();
					this.complete = null;
				}
				this.isSearching = false;
			});
	}

	private buildList() {
		this.items = [];
		this.getItems();
	}

	private getDefaultImg(product: Product): string {
		if (product.store)
			switch (product.store.category) {
				case 'Posto de Combustível':
					return './assets/img/no-image/fuel.png';
			}
		return './assets/img/no-image/default.png';
	}
	// methods end

	// events start
	openItemDetail(item) {
		this.navCtrl.push('page-products-detail', { 'id': item._id });
	}

	searching() {
		this.isSearching = true;
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
	// events end
}
