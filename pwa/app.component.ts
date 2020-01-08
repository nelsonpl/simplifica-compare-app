import {Component, ViewChild} from '@angular/core';
import {Nav, Platform} from 'ionic-angular';

export interface MenuItem {
    title: string;
    component: any;
    icon: string;
}

@Component({
    templateUrl: 'app.html'
})
export class compareApp {
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

    accountMenuItems: Array<MenuItem>;

    helpMenuItems: Array<MenuItem>;

    constructor(public platform: Platform) {
        this.initializeApp();

        this.homeItem = { component: 'page-home' };
        this.messagesItem = { component: 'page-message-list'};

        this.appMenuItems = [
            {title: 'Estabelecimentos', component: 'page-store-list', icon: 'pin'},
            {title: 'Categorias', component: 'page-category', icon: 'albums'},
            {title: 'Produtos', component: 'page-products-list', icon: 'pricetags'},
            {title: 'Lista de Compras', component: 'page-shopping-list', icon: 'list-box'},
            {title: 'Nas próximidades', component: 'page-nearby', icon: 'navigate'},
            {title: 'Meu Carrinho', component: 'page-cart', icon: 'cart'},
			{title: 'Indicações', component: 'page-indication-list', icon: 'thumbs-up'},
			{title: 'Produtos Favoritos', component: 'page-favorite-products', icon: 'heart'}
        ];

        // this.yourRestaurantMenuItems = [
        //     {title: 'Register Restaurant', component: 'page-your-restaurant', icon: 'clipboard'}
        // ];


        this.accountMenuItems = [
            {title: 'Entrar', component: 'page-auth', icon: 'log-in'},
            {title: 'Minha conta', component: 'page-my-account', icon: 'contact'},
            {title: 'Sair', component: 'page-auth', icon: 'log-out'},
        ];

        this.helpMenuItems = [
            {title: 'Sobre nós', component: 'page-about', icon: 'information-circle'},
            {title: 'Suporte', component: 'page-support', icon: 'call'},
            // {title: 'Configurações', component: 'page-settings', icon: 'cog'},
            {title: 'Como funciona', component: 'page-walkthrough', icon: 'photos'}
        ];

    }

    initializeApp() {
        this.platform.ready().then(() => {
			// Okay, so the platform is ready and our plugins are available.
        });

	    if (!this.platform.is('mobile')) {
	      this.tabsPlacement = 'top';
	      this.tabsLayout = 'icon-left';
	    }
    }

    openPage(page) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        this.nav.setRoot(page.component);
    }
}
