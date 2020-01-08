import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShoppingDetailPage } from './shopping-detail';

import { AgmCoreModule } from '@agm/core';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
	declarations: [
		ShoppingDetailPage
	],
	imports: [
		IonicPageModule.forChild(ShoppingDetailPage),
		AgmCoreModule.forRoot({
			apiKey: 'AIzaSyD9BxeSvt3u--Oj-_GD-qG2nPr1uODrR0Y'
		}),
		PipesModule
	],
	exports: [
		ShoppingDetailPage
	]
})

export class ShoppingDetailPageModule { }
