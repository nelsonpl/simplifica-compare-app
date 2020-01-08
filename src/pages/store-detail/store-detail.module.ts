import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AgmCoreModule } from '@agm/core';
import { StoreDetailPage } from './store-detail';

@NgModule({
	declarations: [
		StoreDetailPage
	],
	imports: [
		IonicPageModule.forChild(StoreDetailPage),
		AgmCoreModule.forRoot({
			apiKey: 'AIzaSyD9BxeSvt3u--Oj-_GD-qG2nPr1uODrR0Y'
		})
	],
	exports: [
		StoreDetailPage
	]
})

export class StoreDetailPageModule { }
