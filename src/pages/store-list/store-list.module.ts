import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StoreListPage } from './store-list';

import { AgmCoreModule } from '@agm/core';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
	declarations: [
		StoreListPage
	],
	imports: [
		IonicPageModule.forChild(StoreListPage),
		AgmCoreModule.forRoot({
			apiKey: 'AIzaSyD9BxeSvt3u--Oj-_GD-qG2nPr1uODrR0Y'
		}),
		PipesModule
	],
	exports: [
		StoreListPage
	]
})

export class StoreListPageModule { }
