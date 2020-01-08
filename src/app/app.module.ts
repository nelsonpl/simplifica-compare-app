import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';

import { compareApp } from './app.component';

import { PipesModule } from '../pipes/pipes.module';

import { MessageService } from "../providers/message-service-rest";
import { StoreService } from "../providers/store-service-rest";
import { ProductService } from "../providers/product-service-rest";
import { ShoppingListService } from "../providers/shopping-list-service-rest";
import { AuthService } from "../providers/auth-service-rest";
import { UserService } from "../providers/user-service-rest";
import { AccesscodeService } from "../providers/accesscode-service-rest";
import { LovService } from "../providers/lov-service-rest";
import { ComparationService } from "../providers/comparation-service-rest";
import { ServiceUtils } from "../providers/serviceUtils";

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard } from '@ionic-native/keyboard';

import { JwtInterceptor } from '../providers/JwtInterceptor';
import { Push } from '@ionic-native/push';
import { SocialSharing } from '@ionic-native/social-sharing';
import { MyLocationComponentModule } from '../components/my-location/my-location.module';
import { MyLocationService } from '../providers/my-location-service';
import { Geolocation } from '@ionic-native/geolocation';
import { NotificationTokenService } from '../providers/notification-token-service-rest';
import { NotificationService } from '../services/notification-service';
import { ProductIndicationService } from '../providers/product-indication-service-rest';
import { ProductFavoriteService } from '../providers/product-favorite-service-rest';
import { ProductImgDefault } from '../toolbox/product-img-default';
import { MyToast } from '../toolbox/my-toast';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { Utils } from '../toolbox/utils';
import { GooglePlus } from '@ionic-native/google-plus';
import { SsoService } from '../services/sso-service';

@NgModule({
  declarations: [
    compareApp
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(compareApp, {
      preloadModules: true,
      scrollPadding: false,
      scrollAssist: true,
      autoFocusAssist: false,
      backButtonText: "",
    }),
    IonicStorageModule.forRoot({
      name: '__compareDB',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    }),
    PipesModule,
    MyLocationComponentModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    compareApp
  ],

  providers: [
    StatusBar,
    SplashScreen,
    Keyboard,
    StoreService,
    ProductService,
    ProductFavoriteService,
    ProductIndicationService,
    MessageService,
    ShoppingListService,
    AuthService,
    UserService,
    AccesscodeService,
    LovService,
    ComparationService,
    ServiceUtils,
    Push,
    SocialSharing,
    MyLocationService,
    NotificationTokenService,
    Geolocation,
    NotificationService,
    ProductImgDefault,
    MyToast,
    LaunchNavigator,
    Utils,
    GooglePlus,
    SsoService,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ]
})
export class AppModule { }
