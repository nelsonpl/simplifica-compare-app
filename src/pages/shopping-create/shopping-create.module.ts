import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShoppingCreatePage } from './shopping-create';

@NgModule({
	declarations: [
		ShoppingCreatePage
	],
	imports: [
		IonicPageModule.forChild(ShoppingCreatePage)
	],
	exports: [
		ShoppingCreatePage
	]
})

export class ShoppingCreatePageModule { }
