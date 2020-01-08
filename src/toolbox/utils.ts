import { Injectable } from "@angular/core";
import { Platform } from "ionic-angular";
import { LaunchNavigator } from "@ionic-native/launch-navigator";

@Injectable()
export class Utils {

    constructor(private platform: Platform, private launchNavigator: LaunchNavigator) {
    }

    openMap(latitude?: number, longitude?: number, address?: string) {
        if (this.platform.is('ios') || this.platform.is('android')) {
            if (latitude)
                this.launchNavigator.navigate([latitude, longitude])
                    .then(success => console.log('Launched navigator')
                        , error => console.log('Error launching navigator', error));
            else
                this.launchNavigator.navigate(address)
                    .then(success => console.log('Launched navigator')
                        , error => console.log('Error launching navigator', error));
        }
        else {
            if (latitude)
                window.open(`https://www.google.com.br/maps/dir/''/${latitude},${longitude}`, "_system");
            else
                window.open(`https://www.google.com.br/maps/dir/''/${address}`, "_system");

        }
    }

}