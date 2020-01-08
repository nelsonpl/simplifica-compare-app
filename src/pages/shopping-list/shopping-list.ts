import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, ActionSheetController } from 'ionic-angular';
import { ShoppingListService } from '../../providers/shopping-list-service-rest';
import { AuthService } from '../../providers/auth-service-rest';
import { ShoppingList } from '../../models/shoppingList';
import { MyToast } from '../../toolbox/my-toast';

@IonicPage({
  name: 'page-shopping-list',
  segment: 'shopping-list'
})

@Component({
  selector: 'page-shopping-list',
  templateUrl: 'shopping-list.html',
})

export class ShoppingListPage implements OnInit {

  shoppingList: Array<any> = [];
  isSearching: any = false;
  private complete: () => void;


  constructor(private myToast: MyToast, private actionSheetCtrl: ActionSheetController, private navCtrl: NavController, private shoppingService: ShoppingListService, private authService: AuthService) {
  }

  ngOnInit() {
    this.buildList();
  }

  // methods start
  getItems(): void {
    this.isSearching = true;
    this.shoppingService.findAll()
      .subscribe((items: any[]) => {
        this.shoppingList = this.shoppingList.concat(items);
        if (this.complete) {
          this.complete();
          this.complete = null;
        }
        this.isSearching = false;
      });
  }

  buildList() {
    this.shoppingList = [];
    this.getItems();
  }

  getOrders() {
    this.shoppingService.findAll()
      .subscribe((data: any[]) => {
        this.shoppingList = data
      });
  }

  ionViewCanEnter() {
    if (this.authService.currentUserValue == null)
      setTimeout(() => {
        this.myToast.show('Para acessar sua lista de compras você precisa estar logado.');
        this.navCtrl.goToRoot({});
      }, 200);
    return this.authService.currentUserValue != null;
  }
  // methods end

  // events start
  onSearching() {
    this.isSearching = true;
  }

  onOpenShoppingListDetail(shoppingList) {
    this.navCtrl.push('page-shopping-detail', { 'id': shoppingList._id });
  }

  onActions(item: ShoppingList) {
    const actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Remover',
          handler: () => {
            this.shoppingService.remove(item._id).subscribe(data => {
              if (data) {
                this.shoppingList = [];
                this.buildList();
              }
            });
          }
        }, {
          text: 'Editar',
          handler: () => {
            this.navCtrl.push('page-shopping-create', { 'id': item._id });
          }
        }, {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    actionSheet.present();
  }
  // events end

}
