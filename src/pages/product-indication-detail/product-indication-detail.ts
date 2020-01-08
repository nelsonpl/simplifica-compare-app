import { Component, OnInit } from '@angular/core';
import { IonicPage, NavParams, NavController, Platform, ActionSheet, ActionSheetController } from 'ionic-angular';
import { ProductIndicationService } from '../../providers/product-indication-service-rest';
import { Product } from '../../models/product';
import { environment } from '../../environments/environment';
import { SocialSharing } from '@ionic-native/social-sharing';

@IonicPage({
  name: 'page-product-indication-detail',
  segment: 'product-indication/:id'
})

@Component({
  selector: 'page-product-indication-detail',
  templateUrl: 'product-indication-detail.html'
})
export class ProductsDetailPage implements OnInit {
  private productId: string;
  private productImage: string;
  public product: Product;
  public isNotPwa = false;
  public apiUrl = environment.server_url;
  public appUrl = environment.app_url;
  public isShare = false;

  constructor(private navCtrl: NavController, private navParams: NavParams, private service: ProductIndicationService, private platform: Platform, private actionSheetCtrl: ActionSheetController, private socialSharing: SocialSharing) {
    this.productId = this.navParams.get('id');
  }

  //methods start
  ngOnInit() {
    this.isShare = this.platform.is('ios') || this.platform.is('android');
    this.isNotPwa = this.platform.is("ios") || this.platform.is("android");
  }

  ionViewDidEnter() {
    this.service.get(this.productId).subscribe(item => {
      this.product = item;
      this.productImage = `${environment.server_url}storage/product-indiction/${this.product.image}`;
    });
  }

  //methods end

  //events start

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

  productImg(product: Product): string {
    if (product.image)
      return `${this.apiUrl}storage/product-indication/${product.image}`;

    return this.getProductDefaultImg();
  }

  defaultImg(event): void {
    const target = event.target;
    target.src = this.getProductDefaultImg();
  }

  private getProductDefaultImg(): string {
    return './assets/img/no-image/default.png';
  }
  //events end

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

}




