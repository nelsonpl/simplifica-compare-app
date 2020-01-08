import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductFavoriteListPage } from './product-favorite-list';

@NgModule({
	declarations: [
		ProductFavoriteListPage
	],
	imports: [
		IonicPageModule.forChild(ProductFavoriteListPage)
	],
	exports: [
		ProductFavoriteListPage
	]
})

export class ProductFavoriteListPageModule { }
