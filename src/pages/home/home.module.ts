import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import { MyLocationComponentModule } from '../../components/my-location/my-location.module';

@NgModule({
	declarations: [
		HomePage
	],
	imports: [
		IonicPageModule.forChild(HomePage),
		MyLocationComponentModule
	],
	exports: [
		HomePage
	]
})

export class HomePageModule { }
