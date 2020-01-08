import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavParams, ToastController, AlertController, NavController, Platform, ActionSheet, ActionSheetController } from 'ionic-angular';
import { ProductService } from '../../providers/product-service-rest';
import { ProductFavoriteService } from '../../providers/product-favorite-service-rest';
import { ShoppingListService } from '../../providers/shopping-list-service-rest';
import { Lov } from '../../models/lov';
import { LovService } from '../../providers/lov-service-rest';
import { AuthService } from '../../providers/auth-service-rest';
import { Product } from '../../models/product';
import leaflet from 'leaflet';
import { environment } from '../../environments/environment';
import { SocialSharing } from '@ionic-native/social-sharing';
import { ProductFilters } from '../../models/product-filters';
import { ShoppingList } from '../../models/shoppingList';
import { ShoppingListFilters } from '../../models/shoppingList-filters';
import { Utils } from '../../toolbox/utils';

@IonicPage({
  name: 'page-products-detail',
  segment: 'dish/:id'
})

@Component({
  selector: 'page-products-detail',
  templateUrl: 'products-detail.html'
})
export class ProductsDetailPage implements OnInit {
  private productId: string;
  private shoppingListLov: Lov[] = [];
  private productImage: string;
  public product: Product;
  public isAuth = false;
  public map: any;
  public isNotPwa = false;
  public productList: Product[];
  public apiUrl = environment.server_url;
  public appUrl = environment.app_url;
  public shoppList: ShoppingList[];
  public isShare = false;
  public isFavorite: any = false;
  @ViewChild('myMap') mapContainer: ElementRef;

  constructor(private utils: Utils, private productFavoriteService: ProductFavoriteService, private navCtrl: NavController, private navParams: NavParams, private toastCtrl: ToastController, private productService: ProductService, private alertCtrl: AlertController, private shoppingListService: ShoppingListService, private lovService: LovService, private authService: AuthService, private platform: Platform, private actionSheetCtrl: ActionSheetController, private socialSharing: SocialSharing) {
    this.productId = this.navParams.get('id');
  }

  //methods start
  ngOnInit() {
    this.isShare = this.platform.is('ios') || this.platform.is('android');

    if (this.authService.currentUserValue != null) {
      this.isAuth = true;
      this.lovService.shoppingList().subscribe(data => this.shoppingListLov = data);
      this.buildShoppList();
      this.productFavoriteService.is(this.productId).subscribe((data: { isFavorite: boolean }) => {
        this.isFavorite = data.isFavorite;
      });
    }
    this.isNotPwa = this.platform.is("ios") || this.platform.is("android");
  }

  ionViewDidEnter() {
    this.productService.get(this.productId).subscribe(item => {
      this.product = item;
      this.productImage = `${environment.server_url}storage/product/${this.product.image}`;
      if (this.product && this.product.store && this.product.store.geo && this.product.store.geo.coordinates && this.product.store.geo.coordinates.length > 0) {
        this.buildMap();
      }
      this.buildProductList();
    });
  }

  ionViewWillLeave() {
    if (this.map) {
      this.map.off();
      this.map.remove();
    }
  }

  private buildMap() {

    this.mapContainer.nativeElement.innerHTML = `<div id='map_${this.productId}' style='width:100%; height:175px;'></div>`;

    this.map = leaflet.map(`map_${this.productId}`).setView(this.product.store.geo.coordinates, 13.5);

    leaflet.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 36
    }).addTo(this.map);
    let markerGroup = leaflet.featureGroup();
    let marker: any = leaflet.marker(this.product.store.geo.coordinates).on('click', () => {
      this.utils.openMap(this.product.store.geo.coordinates[0], this.product.store.geo.coordinates[1]);
    });
    markerGroup.addLayer(marker);
    this.map.addLayer(markerGroup);
  }

  buildProductList() {
    const filters = new ProductFilters();
    filters.name = this.product.name;
    filters.type = this.product.type;
    this.productService.findAll(1, filters).subscribe((items: Product[]) => {
      this.productList = items;
    }, _ => { });
  }

  buildShoppList() {
    const filters = new ShoppingListFilters();
    filters.productId = this.productId;
    this.shoppingListService.findAll(filters).subscribe((items: ShoppingList[]) => {
      this.shoppList = items;
    }, _ => { });
  }



  addNewList() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Informe o nome da lista');

    alert.addInput({ type: 'text' });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: datas => {
        let listName = 'Minha nova lista de compras';
        if (!datas[0]) {
          this.toast('Produto não adicionado, informe o nome da lista.');
        }

        listName = datas[0];

        this.shoppingListService.createAddOneProduct(listName, this.productId).subscribe(data => {
          if (data) {
            this.toast('Produto adicionado a lista.');
          }
        });
      }
    });
    alert.present();
  }

  private toast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      cssClass: 'mytoast',
      duration: 2000
    });
    toast.present(toast);
  }
  //methods end

  //events start
  onAddShopp() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Selecione');

    this.shoppingListLov.forEach(item => alert.addInput({ type: 'radio', label: item.text, value: item._id }));
    alert.addInput({ type: 'radio', label: '[Criar uma nova lista...]', value: 'new' });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        if (data === 'new') {
          this.addNewList();
        }
        else {
          this.shoppingListService.updateAddProduct(data, this.productId).subscribe(data => {
            if (data) {
              this.toast('Produto adicionado a lista.');
            }
          });
        }
      }
    });
    alert.present();
  }

  onNavigate() {
    if (this.product.store.geo) {
      this.utils.openMap(this.product.store.geo.coordinates[0], this.product.store.geo.coordinates[1]);
    }
    else {
      const address = this.product.store.address + ' ' + this.product.store.number + ' ' + this.product.store.neighborhood + ' ' + this.product.store.city + ' ' + this.product.store.state;
      this.utils.openMap(null, null, address);
    }
  }

  onShare() {
    let actionSheet: ActionSheet = this.actionSheetCtrl.create({
      title: 'Compartilhar',
      buttons: [
        {
          text: 'Twitter',
          handler: () => {
            this.socialSharing.shareViaTwitter("Confira essa oferta! Compare&Poupe", this.productImage, `${this.appUrl}dish/${this.productId}`)
              .then(_ => { })
              .catch(_ => { });
          },
        },
        {
          text: 'Facebook',
          handler: () => {
            this.socialSharing.shareViaFacebook("Confira essa oferta! Compare&Poupe", this.productImage, `${this.appUrl}dish/${this.productId}`)
              .then(_ => { })
              .catch(_ => { });
          },
        },
        {
          text: 'WhatsApp',
          handler: () => {
            this.socialSharing.shareViaWhatsApp("Confira essa oferta! Compare&Poupe", this.productImage, `${this.appUrl}dish/${this.productId}`)
              .then(_ => { })
              .catch(_ => { });
          },
        },
        {
          text: 'Instagram',
          handler: () => {
            this.socialSharing.shareViaInstagram("Confira essa oferta! Compare&Poupe", this.productImage)
              .then(_ => { })
              .catch(_ => { });
          },
        },
        {
          text: 'Cancelar',
          role: 'cancel',
        }
      ]
    });

    actionSheet.present();
  }

  onOpenProductDetail(product: Product) {
    this.navCtrl.push('page-products-detail', { 'id': product._id });
  }

  onOpenShoppList(shopp: ShoppingList) {
    this.navCtrl.push('page-shopping-detail', { 'id': shopp._id });
  }

  productImg(product: Product): string {
    if (product.image)
      return `${this.apiUrl}storage/product/${product.image}`;

    return this.getProductDefaultImg(product);
  }

  defaultImg(event, product: Product): void {
    const target = event.target;
    target.src = this.getProductDefaultImg(product);
  }

  private getProductDefaultImg(product: Product): string {
    if (product.store)
      switch (product.store.category) {
        case 'Posto de Combustível':
          return './assets/img/no-image/fuel.png';
      }
    return './assets/img/no-image/default.png';

  }

  openHome() {
    this.navCtrl.push('page-home');
  }

  openNearby() {
    this.navCtrl.push('page-nearby');
  }

  openStoreListPage() {
    this.navCtrl.push('page-store-list');
  }

  openProducts() {
    this.navCtrl.push('page-products-list');
  }

  favorite() {
    if (this.isFavorite)
      this.productFavoriteService.delete(this.productId).subscribe(data => {
        if (data)
          this.isFavorite = false;
      });
    else
      this.productFavoriteService.add(this.productId).subscribe(data => {
        if (data)
          this.isFavorite = true;
      });
  }

  //events end
}




