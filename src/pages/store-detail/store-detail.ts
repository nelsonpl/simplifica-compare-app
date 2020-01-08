import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StoreService } from '../../providers/store-service-rest';
import { ProductService } from '../../providers/product-service-rest';
import { ProductFilters } from '../../models/product-filters';
import { Store } from '../../models/store';
import { environment } from '../../environments/environment';
import leaflet from 'leaflet';
import { Product } from '../../models/product';
import { Utils } from '../../toolbox/utils';

@IonicPage({
    name: 'page-store-detail',
    segment: 'store/:id'
})

@Component({
    selector: 'page-store-detail',
    templateUrl: 'store-detail.html'
})
export class StoreDetailPage implements OnInit {

    storeId: number;
    store: any;
    productsopts: String = 'products';
    productList: Array<any> = [];
    productListPage = 1;
    productListComplete = () => { };
    public apiUrl = environment.server_url;
    public map: any;
    @ViewChild('myMapStore') mapContainer: ElementRef;

    constructor(private utils: Utils, private navCtrl: NavController, private navParams: NavParams, private restaurantService: StoreService, private dishService: ProductService) {
        this.storeId = this.navParams.get('id');
        this.productListBuild()
    }

    ngOnInit() {
    }

    ionViewWillEnter() {
        this.restaurantService.get(this.storeId).subscribe(item => {
            this.store = item;
            if (this.store && this.store.geo && this.store.geo.coordinates && this.store.geo.coordinates.length > 0) {
                this.buildMap();
            }
        });
    }

    ionViewWillLeave() {
        if (this.map) {
            this.map.off();
            this.map.remove();
        }
    }

    // methods start

    private buildMap() {

        this.mapContainer.nativeElement.innerHTML = `<div id='map_store_${this.storeId}' style='width:100%; height:175px;'></div>`;
        this.map = leaflet.map(`map_store_${this.storeId}`).setView(this.store.geo.coordinates, 13.5);

        leaflet.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 36
        }).addTo(this.map);
        let markerGroup = leaflet.featureGroup();
        let marker: any = leaflet.marker(this.store.geo.coordinates).on('click', () => {
            this.utils.openMap(this.store.geo.coordinates[0], this.store.geo.coordinates[1]);
        });
        markerGroup.addLayer(marker);
        this.map.addLayer(markerGroup);
    }

    productListBuild() {
        const filters = new ProductFilters();
        filters.store = this.storeId;
        this.dishService.findAll(this.productListPage, filters).subscribe((items: Store[]) => {
            this.productList = this.productList.concat(items);
            if (items.length) {
                this.productListPage++;
            }

            this.productListComplete();
            this.productListComplete = () => { };
        }, error => alert(error));
    }

    private getProductDefaultImg(product: Product): string {
        switch (product.store.category) {
            case 'Posto de Combustível':
                return './assets/img/no-image/fuel.png';
        }
        return './assets/img/no-image/default.png';
    }

    private getStoreDefaultImg(): string {
        switch (this.store.category) {
            case 'Posto de Combustível':
                return './assets/img/no-image/gas-station.png';
        }
        return './assets/img/no-image/default.png';
    }
    // methods end

    // events start

    onOpenProductDetail(product) {
        this.navCtrl.push('page-products-detail', { 'id': product._id });
    }

    onProductListInfinite(event) {
        this.productListComplete = () => event.complete();
        this.productListBuild();
    }

    onEdit() {
        this.navCtrl.push('page-store-create', { 'id': this.storeId });
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

    onStoreImg(): string {
        if (this.store.image)
            return `${this.apiUrl}storage/store/${this.store.image}`;
        else
            return this.getStoreDefaultImg();
    }

    onDefaultImg(event): void {
        const target = event.target;
        target.src = this.getStoreDefaultImg();;
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
