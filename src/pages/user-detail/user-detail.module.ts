import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserDetailPage } from './user-detail';

@NgModule({
	declarations: [
		UserDetailPage
	],
	imports: [
		IonicPageModule.forChild(UserDetailPage)
	],
	exports: [
		UserDetailPage
	]
})

export class ProductsDetailPageModule { }
