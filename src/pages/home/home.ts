import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, MenuController, ModalController } from 'ionic-angular';
import { StoreService } from '../../providers/store-service-rest';
import { ProductService } from '../../providers/product-service-rest';
import { Product } from '../../models/product';
import { Store } from '../../models/store';
import { environment } from '../../environments/environment';
import { MessageService } from '../../providers/message-service-rest';

@IonicPage({
  name: 'page-home',
  segment: 'home',
  priority: 'high'
})

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage implements OnInit {

  restaurants: Array<any>;
  dishes: Array<any>;
  searchKey: string = "";
  public apiUrl = environment.server_url;
  public isNewMsg = false;

  constructor(private msgService: MessageService, private navCtrl: NavController, private menuCtrl: MenuController, private modalCtrl: ModalController, private service: StoreService, private dishService: ProductService) {
    this.menuCtrl.swipeEnable(true, 'authenticated');
    this.menuCtrl.enable(true);
    this.checkNewMsgs();
  }

  ngOnInit() {
    this.findAll();
    this.findAllProducts();
  }

  ionViewWillEnter() {
    this.navCtrl.canSwipeBack();
  }

  private getProductImgDefault(product: Product): string {
    if (product.store)
      switch (product.store.category) {
        case 'Posto de Combustível':
          return './assets/img/no-image/fuel.png';
      }

    return './assets/img/no-image/default.png';
  }

  private getStoreDefaultImg(store: Store): string {
    switch (store.category) {
      case 'Posto de Combustível':
        return './assets/img/no-image/gas-station.png';
    }
    return './assets/img/no-image/default.png';
  }

  private checkNewMsgs() {
    this.msgService.getNewMsg().then(isNewMsg => {
      this.isNewMsg = false;
      if (!isNewMsg)
        return;

      this.isNewMsg = true;
      this.msgService.setNewMsg(false);
    });
  }

  private findAll() {
    this.service.listHome().subscribe((items: Store[]) => { this.restaurants = items }, error => alert(error));
  }

  private findAllProducts() {
    this.dishService.listHome().subscribe((items: Product[]) => { this.dishes = items }, error => alert(error));
  }

  openHome() {
    this.navCtrl.push('page-home');
  }

  openNearby() {
    this.navCtrl.push('page-nearby');
  }

  openProductsDetail(product: Product) {
    this.navCtrl.push('page-products-detail', {
      'id': product._id
    });
  }

  openStoreListPage() {
    this.navCtrl.push('page-store-list');
  }

  openFilter() {
    let modal = this.modalCtrl.create('page-products-filter');
    modal.present();
  }

  openProducts() {
    this.navCtrl.push('page-products-list');
  }

  openList() {
    this.navCtrl.push('page-shopping-list');
  }

  openIndicationList() {
    this.navCtrl.push('page-indication-list');
  }

  openCart() {
    this.navCtrl.push('page-cart');
  }

  openStoreDetail(store: any) {
    this.navCtrl.push('page-store-detail', {
      'id': store._id
    });
  }

  openSettingsPage() {
    this.navCtrl.push('page-settings');
  }

  onInput(event) {
  }

  onCancel(event) {
    this.findAll();
  }

  openMessage() {
    this.isNewMsg = false;
    this.navCtrl.push('page-message-list');
  }

  productImg(product: Product): string {
    if (product.image)
      return `${this.apiUrl}storage/product/${product.image}`;
    else {
      return this.getProductImgDefault(product);
    }
  }

  defaultImg(event, product: Product): void {
    const target = event.target;
    target.src = this.getProductImgDefault(product);
  }

  storeImg(store: Store): string {
    if (store.image)
      return `${this.apiUrl}storage/store/${store.image}`;
    else
      return this.getStoreDefaultImg(store);
  }

  defaultStoreImg(event, store: Store): void {
    const target = event.target;
    target.src = this.getStoreDefaultImg(store);
  }

}
