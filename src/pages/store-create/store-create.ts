import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LovService } from '../../providers/lov-service-rest';
import { Lov } from '../../models/lov';
import { AuthService } from '../../providers/auth-service-rest';
import { Store } from '../../models/store';
import { StoreService } from '../../providers/store-service-rest';
import { MyGeo } from '../../models/my-geo';
import { environment } from '../../environments/environment';

@IonicPage({
  name: 'page-store-create',
  segment: 'store-create/:id'
})

@Component({
  selector: 'page-store-create',
  templateUrl: 'store-create.html'
})
export class StoreCreatePage implements OnInit {

  private isCopy: boolean = false;
  public store: Store = new Store();
  public onForm: FormGroup;
  public stateList: Lov[] = [];
  public categoryList: Lov[] = [];
  public userList: Lov[] = [];
  public storeId: string;
  public latitude: number = 0;
  public longitude: number = 0;
  public cityList: Lov[];
  public uploadedFiles: Array<File>;
  public apiUrl = environment.server_url;

  constructor(private _fb: FormBuilder, private lovService: LovService, private storeService: StoreService, private authService: AuthService, private navCtrl: NavController, private navParams: NavParams) {
    this.storeId = this.navParams.get('id');
    this.isCopy = this.navParams.get('copy');
  }

  ngOnInit() {
    this.onForm = this._fb.group({
      name: ['', Validators.compose([Validators.required])],
      state: ['', Validators.compose([Validators.required])],
      city: ['', Validators.compose([Validators.required])],
      address: '',
      number: '',
      neighborhood: '',
      ref: '',
      email: '',
      phone: '',
      complement: '',
      cell: '',
      category: '',
      isShowHome: '',
      latitude: '',
      longitude: '',
      userOwner: ''
    });

    this.stateList = this.lovService.state();
    this.categoryList = this.lovService.storeCategory();
    this.lovService.client().subscribe(data => this.userList = data);

    if (this.storeId)
      this.storeService.get(this.storeId).subscribe(item => {
        this.store = item;
        if (item.geo && item.geo.coordinates) {
          this.latitude = item.geo.coordinates[0];
          this.longitude = item.geo.coordinates[1];
        }
        if (this.isCopy)
          delete this.store._id;
      });
  }

  ionViewCanEnter() {
    if (this.authService.currentUserValue == null)
      setTimeout(() => { this.navCtrl.goToRoot({}); }, 200);
    return this.authService.currentUserValue != null;
  }

  //methods start
  //methods end

  //events start
  onSubmit() {
    const latlon = [this.latitude, this.longitude];
    this.store.geo = new MyGeo();
    this.store.geo.type = 'Point';
    this.store.geo.coordinates = latlon;
    this.storeService.save(this.store).subscribe((data: { id: string, message: string }) => {
      if (data && this.uploadedFiles) {
        let formData = new FormData();
        for (var i = 0; i < this.uploadedFiles.length; i++) {
          const name = `${data.id}.png`;
          formData.append("uploads", this.uploadedFiles[i], name);
        }
        this.storeService.saveImg(data.id, formData).subscribe(dataImg => this.navCtrl.pop());
      }
      else {
        this.navCtrl.pop();
      }
    });
  }

  onCityBuild(state: string) {
    if (state)
      this.cityList = this.lovService.city(state);
  }


  fileChange(element) {
    this.uploadedFiles = element.target.files;
  }

  onStoreImg(): string {
    return `${this.apiUrl}storage/store/${this.storeId}.png`;
  }

  onDefaultImg(event): void {
    const target = event.target;
    target.src = '../../assets/img/no-image/default.png';

    switch (this.store.category) {
      case 'Posto de Combustível':
        target.src = '../../assets/img/no-image/gas-station.png';
        break;
    }
  }
  //events end
}
