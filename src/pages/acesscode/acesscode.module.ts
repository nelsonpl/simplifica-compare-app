import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AcesscodePage } from './acesscode';


@NgModule({
	declarations: [
		AcesscodePage
	],
	imports: [
		IonicPageModule.forChild(AcesscodePage)
	],
	exports: [
		AcesscodePage
	]
})

export class AcesscodePageModule { }
