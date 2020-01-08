import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductIndicationCreatePage } from './products-indication-create';

@NgModule({
	declarations: [
		ProductIndicationCreatePage
	],
	imports: [
		IonicPageModule.forChild(ProductIndicationCreatePage)
	],
	exports: [
		ProductIndicationCreatePage
	]
})

export class ProductIndicationCreatePageModule { }
