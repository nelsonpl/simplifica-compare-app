import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductIndicationListPage } from './product-indication-list';

@NgModule({
	declarations: [
		ProductIndicationListPage
	],
	imports: [
		IonicPageModule.forChild(ProductIndicationListPage)
	],
	exports: [
		ProductIndicationListPage
	]
})

export class ProductIndicationListPageModule { }
