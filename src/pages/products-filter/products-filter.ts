import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, ViewController } from 'ionic-angular';
import { ProductFilters } from '../../models/product-filters';
import { LovService } from '../../providers/lov-service-rest';
import { Lov } from '../../models/lov';

@IonicPage({
	name: 'page-products-filter',
	segment: 'products-filter'
})

@Component({
	selector: 'page-products-filter',
	templateUrl: 'products-filter.html',
})

export class ProductsFilterPage implements OnInit {
	filters: ProductFilters = new ProductFilters();
	priceRange: any;
	categoryList: Lov[] = [];

	constructor(private navCtrl: NavController, private viewCtrl: ViewController, private lovService: LovService) {
	}

	ngOnInit(): void {
		this.priceRange = { lower: 0, upper: 100 };
		this.categoryList = this.lovService.storeCategory();
	}

	closeModal() {
		this.navCtrl.pop();
	}

	filter() {
		if (this.priceRange.upper > 0) {
			this.filters.priceLower = this.priceRange.lower || 0;
			this.filters.priceUpper = this.priceRange.upper;
		}
		this.viewCtrl.dismiss(this.filters);
	}

}
