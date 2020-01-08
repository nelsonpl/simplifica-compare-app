import { Component, ViewChild, OnInit } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { AuthService } from '../providers/auth-service-rest';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { NotificationService } from '../services/notification-service';
import { MessageService } from '../providers/message-service-rest';
import { Session } from '../models/Session';

export interface MenuItem {
    title: string;
    component: any;
    icon: string;
}

@Component({
    templateUrl: 'app.html'
})
export class compareApp implements OnInit {

    @ViewChild(Nav) nav: Nav;

    tabsPlacement: string = 'bottom';
    tabsLayout: string = 'icon-top';
    rootPage: any = 'page-walkthrough';
    showMenu: boolean = true;
    homeItem: any;
    initialItem: any;
    messagesItem: any;
    settingsItem: any;
    appMenuItems: Array<MenuItem>;
    yourRestaurantMenuItems: Array<MenuItem>;
    helpMenuItems: Array<MenuItem>;
    loginMenuItem: MenuItem;
    perfilMenuItem: MenuItem;
    userName = '';
    messageTotal = '';
    isNewMsg: boolean = false;

    constructor(private msgService: MessageService, public platform: Platform, private authService: AuthService, private splashScreen: SplashScreen, private statusBar: StatusBar, private notificationService: NotificationService) {
        this.initializeApp();

        this.homeItem = { component: 'page-home' };
        this.messagesItem = { component: 'page-message-list' };

        this.appMenuItems = [
            { title: 'Estabelecimentos', component: 'page-store-list', icon: 'pin' },
            { title: 'Produtos', component: 'page-products-list', icon: 'pricetags' },
            { title: 'Proximidades', component: 'page-nearby', icon: 'map' },
            { title: 'Lista de Compras', component: 'page-shopping-list', icon: 'list-box' },
            { title: 'Indicações', component: 'page-product-indication-list', icon: 'thumbs-up' },
            { title: 'Produtos Favoritos', component: 'page-product-favorite-list', icon: 'heart' }
        ];

        this.helpMenuItems = [
            { title: 'Sobre nós', component: 'page-about', icon: 'information-circle' },
            { title: 'Suporte', component: 'page-support', icon: 'call' },
            { title: 'Como funciona', component: 'page-walkthrough', icon: 'photos' }
        ];

    }

    async ngOnInit(): Promise<void> {
        if (this.authService.currentUserValue != null)
            this.buildMenus(this.authService.currentUserValue);

        this.authService.currentUser.subscribe(session => {
            this.buildMenus(session);
        });
        this.checkNewMsgs();
    }

    private buildMenus(session: Session) {
        this.loginMenuItem = null;
        this.perfilMenuItem = null;
        if (session) {
            this.perfilMenuItem = { title: 'Minha conta', component: 'page-my-account', icon: 'contact' };
            this.loginMenuItem = { title: 'Sair', component: 'page-auth', icon: 'log-out' };
            this.userName = session.userName;
        }
        else {
            this.loginMenuItem = { title: 'Entrar', component: 'page-auth', icon: 'log-in' };
            this.userName = '';
        }
    }

    checkNewMsgs() {
        const date = new Date();
        date.setDate(date.getDate() - 3);
        this.msgService.getAll(1, date).subscribe(data => {
            this.isNewMsg = data != null;
            this.msgService.setNewMsg(this.isNewMsg);
        });
    }

    initializeApp() {
        this.platform.ready().then(async () => {
            this.notificationService.init();
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });

        if (!this.platform.is('mobile')) {
            this.tabsPlacement = 'top';
            this.tabsLayout = 'icon-left';
        }

    }

    openPage(page) {
        if (page.component === 'page-message-list')
            this.isNewMsg = false;
        this.nav.setRoot(page.component);
    }

}
