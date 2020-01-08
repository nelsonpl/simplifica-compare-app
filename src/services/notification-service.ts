
import { Injectable } from '@angular/core';
import { NotificationTokenService } from '../providers/notification-token-service-rest';
import { PushOptions, PushObject, Push } from '@ionic-native/push';

@Injectable()
export class NotificationService {

    constructor(private notificationTokenService: NotificationTokenService, private push: Push) { }

    init() {
        const options: PushOptions = {
            android: {
                senderID: '709563169605'
            },
            ios: {
                alert: 'true',
                badge: true,
                sound: 'false'
            },
            windows: {},
            browser: {
                pushServiceURL: 'http://push.api.phonegap.com/v1/push'
            }
        }

        const pushObject: PushObject = this.push.init(options);

        pushObject.on('notification').subscribe((notification: any) => console.log('Received a notification', notification));

        pushObject.on('registration').subscribe((registration: any) => this.notificationTokenService.create(registration.registrationId));

        pushObject.on('error').subscribe(error => console.error('Error with Push plugin', JSON.stringify(error)));
    }
}
