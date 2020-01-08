import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyLocationComponent } from './my-location';

@NgModule({
	declarations: [
		MyLocationComponent
	],
	imports: [
		IonicPageModule.forChild(MyLocationComponent)
	],
	exports: [
		MyLocationComponent
	],
	entryComponents:[
		MyLocationComponent
	]
})

export class MyLocationComponentModule { }
