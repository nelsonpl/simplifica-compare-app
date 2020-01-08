import { Component, OnInit } from '@angular/core';
import { IonicPage, NavParams, NavController } from 'ionic-angular';
import { ShoppingList } from '../../models/shoppingList';
import { ShoppingListService } from '../../providers/shopping-list-service-rest';
import { Store } from '../../models/store';
import { ComparationService } from '../../providers/comparation-service-rest';
import { Product } from '../../models/product';
import { AuthService } from '../../providers/auth-service-rest';
import { environment } from '../../environments/environment';

@IonicPage({
    name: 'page-shopping-detail',
    segment: 'shopping-detail/:id'
})

@Component({
    selector: 'shopping-detail',
    templateUrl: 'shopping-detail.html'
})
export class ShoppingDetailPage implements OnInit {

    private shoppingId: string;
    public isSearching: boolean = true;
    public shopping: ShoppingList;
    public storeList: Store[] = [];
    public apiUrl = environment.server_url;
    public isShowProducts: boolean = false;

    constructor(private navCtrl: NavController, private navParams: NavParams, private shoppingService: ShoppingListService, private comparationService: ComparationService, private authService: AuthService) {
        this.shoppingId = this.navParams.get("id");
    }

    // methods start
    ngOnInit() {
        this.shoppingService.get(this.shoppingId).subscribe(item => {
            this.shopping = item;
            this.shopping.productsPriceTotal = this.shopping.products.reduce((p, c) => { return p + c.price; }, 0);
        });
        this.buildList();
    }

    ionViewCanEnter() {
        if (this.authService.currentUserValue == null)
            setTimeout(() => { this.navCtrl.goToRoot({}); }, 200);
        return this.authService.currentUserValue != null;
    }

    private getItems(): void {
        this.comparationService.get(this.shoppingId)
            .subscribe((storeList: Store[]) => {
                this.storeList = storeList;
                this.storeList.forEach(store => {
                    store.productsPriceTotal = store.products.reduce((p, c) => { return p + c.price; }, 0);
                });
                this.isSearching = false;
            });
    }

    private buildList() {
        this.storeList = [];
        this.getItems();
    }

    private getDefaultImg(product: Product): string {
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
    // methods end

    // events start
    onProductImg(product: Product): string {
        if (product.image)
            return `${this.apiUrl}storage/product/${product.image}`;

        return this.getDefaultImg(product);
    }

    onDefaultImg(event, product: Product): void {
        const target = event.target;
        target.src = this.getDefaultImg(product);
    }


    onStoreImg(store: Store): string {
        if (store.image)
            return `${this.apiUrl}storage/store/${store.image}`;
    }

    onStoreDefaultImg(event, store: Store): void {
        const target = event.target;
        target.src = this.getStoreDefaultImg(store);
    }

    onOpenProductDetail(item) {
        this.navCtrl.push('page-products-detail', { 'id': item._id });
    }

    onToggleShoppProducts() {
        this.isShowProducts = !this.isShowProducts;
    }

    onToggleStoreProducts(store: Store) {
        store.isShowProducts = !store.isShowProducts;
    }

    openProductDetail(product: Product) {
        this.navCtrl.push('page-products-detail', { 'id': product._id });
    }

    openStoreDetail(store: Store) {
        this.navCtrl.push('page-store-detail', { 'id': store._id });
    }
    // events end

}
