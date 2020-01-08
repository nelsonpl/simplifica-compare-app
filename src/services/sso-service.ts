
import { Injectable } from '@angular/core';
import { GooglePlus } from '@ionic-native/google-plus';
import { environment } from '../environments/environment';

@Injectable()
export class SsoService {

    private googleConfig = {
        'scopes': '', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
        'webClientId': environment.webClientId, // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
        'offline': true // optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
    };

    constructor(private googlePlus: GooglePlus) { }

    // obj.email          // 'eddyverbruggen@gmail.com'
    // obj.userId         // user id
    // obj.displayName    // 'Eddy Verbruggen'
    // obj.familyName     // 'Verbruggen'
    // obj.givenName      // 'Eddy'
    // obj.imageUrl       // 'http://link-to-my-profilepic.google.com'
    // obj.idToken        // idToken that can be exchanged to verify user identity.
    // obj.serverAuthCode // Auth code that can be exchanged for an access token and refresh token for offline access
    // obj.accessToken    // OAuth2 access token

    async googleLogin() {
        // this.googlePlus.login(this.googleConfig)
        //     .then(x => console.info(JSON.stringify(x)))
        //     .catch(x => console.error(JSON.stringify(x)));
        return await this.googlePlus.trySilentLogin(this.googleConfig)
            .catch(async _ => {
                return await this.googlePlus.login(this.googleConfig)
                .catch(_ => { return null; });
            });
    }
}
