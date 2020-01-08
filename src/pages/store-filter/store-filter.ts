import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, ViewController } from 'ionic-angular';
import { StoreFilters } from '../../models/store-filters';
import { Lov } from '../../models/lov';
import { LovService } from '../../providers/lov-service-rest';

@IonicPage({
	name: 'page-store-filter',
	segment: 'store-filter'
})

@Component({
	selector: 'page-store-filter',
	templateUrl: 'store-filter.html',
})

export class StoreFilterPage implements OnInit {

	public filters: StoreFilters = new StoreFilters();
	public priceRange: any;
	public categoryList: Lov[] = [];
	public cityList: Lov[] = [];

	constructor(private navCtrl: NavController, private viewCtrl: ViewController, private lovService: LovService) {
		this.priceRange = { lower: 0, upper: 100 };
	}

	ngOnInit() {
		this.categoryList = this.lovService.storeCategory();
		this.lovService.storeCity().subscribe(data => this.cityList = data);
	}

	closeModal() {
		this.navCtrl.pop();
	}

	filter() {
		this.viewCtrl.dismiss(this.filters);
	}

}
