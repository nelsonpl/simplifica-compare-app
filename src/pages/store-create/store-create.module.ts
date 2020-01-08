import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StoreCreatePage } from './store-create';

@NgModule({
	declarations: [
		StoreCreatePage
	],
	imports: [
		IonicPageModule.forChild(StoreCreatePage)
	],
	exports: [
		StoreCreatePage
	]
})

export class StoreCreatePageModule { }
