import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, ModalController } from 'ionic-angular';
import { StoreService } from '../../providers/store-service-rest';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { StoreFilters } from '../../models/store-filters';
import { Store } from '../../models/store';
import { AuthService } from '../../providers/auth-service-rest';
import { MyLocationService } from '../../providers/my-location-service';
import { environment } from '../../environments/environment';


@IonicPage({
    name: 'page-store-list',
    segment: 'store-list'
})

@Component({
    selector: 'page-store-list',
    templateUrl: 'store-list.html'
})
export class StoreListPage implements OnInit {

    private filters: StoreFilters = new StoreFilters();
    private complete: () => void;
    private page = 1;
    private apiUrl = environment.server_url;
    public isAuth = false;
    public filterCtrl: FormControl;
    public isSearching: any = false;
    public items: Array<any>;
    public isNotItems: boolean = false;


    constructor(private myLocationService: MyLocationService, private navCtrl: NavController, private service: StoreService, private modalCtrl: ModalController, private authService: AuthService) {
        this.filterCtrl = new FormControl();
    }

    // methods start
    ngOnInit(): void {

        this.filterCtrl.valueChanges
            .pipe(debounceTime(700))
            .subscribe(search => {
                this.isSearching = false;
                this.filters.name = search;
                this.buildList();
            });
        this.isAuth = this.authService.currentUserValue != null;

    }

    ionViewWillEnter() {
        this.buildList();
    }

    // methods start

    private async getItems() {
        this.isSearching = true;

        if (!this.filters)
            this.filters = new StoreFilters();

        const myLocation = await this.myLocationService.get();

        if (myLocation)
            this.filters.city = myLocation;

        this.service.findAll(this.page, this.filters)
            .subscribe((items: Store[]) => {
                this.items = this.items.concat(items);

                this.isNotItems = this.items.length == 0;

                if (items.length) {
                    this.page++;
                }
                if (this.complete) {
                    this.complete();
                    this.complete = null;
                }
                this.isSearching = false;
            });
    }

    buildList() {
        this.page = 1;
        this.items = [];
        this.getItems();
    }
    // methods end

    // events start
    onRefresh(event) {
        this.page = 1;
        this.items = [];
        this.filters = new StoreFilters();
        this.complete = () => { event.complete(); };
        this.filterCtrl.setValue('');
    }

    onSearching() {
        this.isSearching = true;
    }

    onInfinite(event) {
        this.complete = () => { event.complete(); };
        this.getItems();
    }

    onOpenItemDetail(item: any) {
        this.navCtrl.push('page-store-detail', {
            'id': item._id
        });
    }

    onOpenFilter() {
        let modal = this.modalCtrl.create('page-store-filter');
        modal.present();
        modal.onDidDismiss(data => {
            this.filters = data;
            this.buildList();
            this.isSearching = false;
        });
    }

    onCancel(event) {
    }

    onRedirectAdd() {
        this.navCtrl.push('page-store-create');
    }

    onStoreImg(store: Store): string {
        if (store.image)
            return `${this.apiUrl}storage/store/${store.image}`;
    }

    onDefaultImg(event, store: Store): void {
        const target = event.target;
        target.src = this.getDefaultImg(store);
    }

    getDefaultImg(store: Store): string {
        switch (store.category) {
            case 'Posto de Combustível':
                return './assets/img/no-image/gas-station.png';
        }
        return './assets/img/no-image/default.png';
    }

    // events end

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
