import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StoreFilterPage } from './store-filter';

@NgModule({
	declarations: [
		StoreFilterPage
	],
	imports: [
		IonicPageModule.forChild(StoreFilterPage)
	],
	exports: [
		StoreFilterPage
	]
})

export class StoreFilterPageModule { }
