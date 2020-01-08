import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ShoppingListService } from '../../providers/shopping-list-service-rest';
import { ShoppingList } from '../../models/shoppingList';
import { ProductService } from '../../providers/product-service-rest';
import { AuthService } from '../../providers/auth-service-rest';
import { ProductImgDefault } from '../../toolbox/product-img-default';

@IonicPage({
  name: 'page-shopping-create',
  segment: 'shopping-create/:id'
})

@Component({
  selector: 'page-shopping-create',
  templateUrl: 'shopping-create.html'
})
export class ShoppingCreatePage {
  private shoppingId: string;
  private shopping: ShoppingList = new ShoppingList();

  constructor(public productImgDefault: ProductImgDefault, private navCtrl: NavController, private navParams: NavParams, private shoppingService: ShoppingListService, private productService: ProductService, private authService: AuthService) {
    this.shoppingId = this.navParams.get('id');
    this.shoppingService.get(this.shoppingId).subscribe(item => this.shopping = item);
  }

  // start methods
  ionViewCanEnter() {
    if (this.authService.currentUserValue == null)
      setTimeout(() => { this.navCtrl.goToRoot({}); }, 200);
    return this.authService.currentUserValue != null;
  }

  // end methods

  // start events
  onGetProductImg(product) {
    return this.productService.getImg(product._id, product.imageMain);
  }

  onOpenProductDetail(product) {
    this.navCtrl.push('page-products-detail', { 'id': product._id });
  }

  onRemove(product) {
    const index = this.shopping.products.indexOf(product, 0);
    if (index > -1) {
      this.shopping.products.splice(index, 1);
    }
  }

  onSave() {
    this.shoppingService.save(this.shopping).subscribe(shoppingUpdated => {
      if (shoppingUpdated)
        this.navCtrl.pop();
    });
  }


  // end events

}
