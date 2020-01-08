import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductsDetailPage } from './products-detail';

@NgModule({
	declarations: [
		ProductsDetailPage
	],
	imports: [
		IonicPageModule.forChild(ProductsDetailPage)
	],
	exports: [
		ProductsDetailPage
	]
})

export class ProductsDetailPageModule { }
