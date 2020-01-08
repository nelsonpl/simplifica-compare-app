import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, Platform } from 'ionic-angular';
import { ProductService } from '../../providers/product-service-rest';
import leaflet, { marker } from 'leaflet';
import { Product } from '../../models/product';
import { Geolocation } from '@ionic-native/geolocation';

@IonicPage({
    name: 'page-nearby',
    segment: 'nearby'
})

@Component({
    selector: 'page-nearby',
    templateUrl: 'nearby.html'
})
export class NearbyPage implements OnInit {

    public map: any;
    @ViewChild('myMap') mapContainer: ElementRef;
    myLocation: string = '';

    constructor(private productService: ProductService, private geolocation: Geolocation, private platform: Platform, private navCtrl: NavController) {
    }

    // methods start
    ngOnInit() {
    }

    ionViewDidEnter() {
        this.buildMap();
    }

    ionViewWillLeave() {
        if (this.map) {
            this.map.off();
            this.map.remove();
        }
    }

    private buildMap() {


        this.mapContainer.nativeElement.innerHTML = `<div id='map' style='width:100%; height:100%;'></div>`;
        this.map = leaflet.map("map").fitWorld();

        if (this.platform.is('ios') || this.platform.is('android')) {
            this.geolocation.getCurrentPosition().then((resp) => {
                this.myLocation = resp.coords.latitude + ',' + resp.coords.longitude;
                this.map.setView([resp.coords.latitude, resp.coords.longitude], 16);
            }).catch((error) => { });
        }
        else {
            this.map.locate({ setView: true, maxZoom: 16 }).on('locationfound', (e) => this.myLocation = e.latitude + ',' + e.longitude);
        }

        leaflet.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
            maxZoom: 36
        }).addTo(this.map);

        this.productService.findAll().subscribe((products: Product[]) => {
            products.forEach(product => {
                if (product && product.store && product.store.geo && product.store.geo.coordinates.length > 0)
                    this.buildStoresMap(product);
            });
        })
    }

    buildStoresMap(product: Product) {
        marker(product.store.geo.coordinates)
            .addTo(this.map)
            .bindPopup(`<p>${product.name} - R$: ${product.price}</p><br/><a href='https://www.google.com.br/maps/dir/${this.myLocation}/${product.store.geo.coordinates[0]},${product.store.geo.coordinates[1]}' target='_blank' >Rota</a>`)
            .bindTooltip(`<p>${product.name} - R$: ${product.price}</p>`);

    }

    // methods end

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
