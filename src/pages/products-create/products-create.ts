import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Product } from '../../models/product';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LovService } from '../../providers/lov-service-rest';
import { Lov } from '../../models/lov';
import { ProductService } from '../../providers/product-service-rest';
import { AuthService } from '../../providers/auth-service-rest';
import { environment } from '../../environments/environment';
import { Store } from '../../models/store';

@IonicPage({
  name: 'page-products-create',
  segment: 'products-create/:id'
})

@Component({
  selector: 'page-products-create',
  templateUrl: 'products-create.html'
})
export class ProductsCreatePage implements OnInit {

  private isCopy: boolean = false;
  private apiUrl = environment.server_url;
  private typeList: Lov[] = [];
  private brandList: Lov[] = [];
  private nameList: Lov[] = [];
  private unitList: Lov[] = [];
  public store: Store;
  public product: Product = new Product();
  public onForm: FormGroup;
  public storeList: Lov[] = [];
  public productId: string;
  public uploadedFiles: Array<File>;
  public isNewType: boolean = false;
  public isNewBrand: boolean = false;
  public isNewName: boolean = false;
  public isNewUnit: boolean = false;
  public typeText = 'Selecione um tipo...';
  public brandText = 'Selecione um tipo...';
  public nameText = 'Selecione um tipo...';
  public unitText = 'Selecione uma unidade de medida...';

  constructor(private alertCtrl: AlertController, private _fb: FormBuilder, private lovService: LovService, private productService: ProductService, private authService: AuthService, private navCtrl: NavController, private navParams: NavParams) {
    this.productId = this.navParams.get('id');
    this.isCopy = this.navParams.get('copy');
    this.product.storeId = this.navParams.get('storeId');
  }

  ngOnInit() {
    this.onForm = this._fb.group({
      type: ['', Validators.compose([Validators.required])],
      brand: ['', Validators.compose([Validators.required])],
      name: ['', Validators.compose([Validators.required])],
      volume: '',
      price: '',
      validity: '',
      unity: '',
      storeId: ['', Validators.compose([Validators.required])],
      description: '',
      packing: '',
      unit: '',
      isShowHome: '',
    });


    if (this.productId)
      this.productService.get(this.productId).subscribe(item => {
        this.product = item;
        this.lovService.productBrand(item.type).subscribe(data => this.brandList = data);
        this.lovService.productName(item.brand).subscribe(data => this.nameList = data);

        if (this.isCopy)
          delete this.product._id;
      });
  }

  ionViewWillEnter() {
    let userOwer = '';
    if (this.authService.currentUserValue.userType === 'CLIENT')
      userOwer = this.authService.currentUserValue.userId;

    this.lovService.store(userOwer).subscribe(data => this.storeList = data);
    this.lovService.productType().subscribe(data => this.typeList = data);
    this.lovService.productUnit().subscribe(data => this.unitList = data);
  }

  ionViewCanEnter() {
    return this.authService.currentUserValue != null;
  }

  //methods start
  //methods end

  //events start
  onSubmit() {
    this.productService.save(this.product)
      .subscribe((data: { id: string, message: string }) => {
        if (data && this.uploadedFiles) {
          let formData = new FormData();
          for (var i = 0; i < this.uploadedFiles.length; i++) {
            const name = `${data.id}.png`;
            formData.append("uploads", this.uploadedFiles[i], name);
          }
          this.productService.saveImg(data.id, formData).subscribe(dataImg => this.navCtrl.pop());
        }
        else {
          this.navCtrl.pop();
        }
      }
      );
  }

  fileChange(element) {
    this.uploadedFiles = element.target.files;
  }

  productImg(): string {
    return `${this.apiUrl}storage/product/${this.product.image}`;
  }

  defaultImg(event): void {
    const target = event.target;
    target.src = '../../assets/img/no-image/default.png';
  }

  selectCategory() {
    if (this.isNewType)
      return;

    let alert = this.alertCtrl.create({
      title: 'Selecione um tipo',
      inputs: [...this.typeList.map((v) => { return { type: 'radio', label: v.text, value: v.text }; }), { type: 'radio', label: '[Novo tipo...]', value: 'new' }],
      buttons: [{ text: 'Cancelar', role: 'cancel' },
      {
        text: 'OK',
        handler: data => {
          if (data === 'new') {
            this.isNewType = true;
            this.isNewName = true;
            this.isNewBrand = true;
            this.product.brand = '';
            this.product.name = '';
            this.product.type = '';
            this.typeText = 'Informe o novo tipo...';
            this.brandText = 'Informe a nova marca...';
            this.nameText = 'Informe o novo produto...';
          }
          else {
            this.product.type = data;
            this.product.brand = '';
            this.product.name = '';
            this.brandText = 'Selecione uma marca...';
            this.lovService.productBrand(data).subscribe(data => this.brandList = data);
          }

        }
      }]
    });

    alert.present();
  }

  selectBrand() {
    if (this.isNewBrand || this.brandList.length === 0)
      return;

    let alert = this.alertCtrl.create({
      title: 'Selecione uma marca',
      inputs: [...this.brandList.map((v) => { return { type: 'radio', label: v.text, value: v.text }; }), { type: 'radio', label: '[Nova marca...]', value: 'new' }],
      buttons: [{ text: 'Cancelar', role: 'cancel' },
      {
        text: 'OK',
        handler: data => {
          if (data === 'new') {
            this.isNewBrand = true;
            this.isNewName = true;
            this.product.name = '';
            this.product.brand = '';
            this.brandText = 'Informe a nova marca...';
            this.nameText = 'Informe o novo produto...';

          }
          else {
            this.product.brand = data;
            this.product.name = '';
            this.lovService.productName(data).subscribe(data => this.nameList = data);

          }

        }
      }]
    });

    alert.present();
  }

  selectName() {
    if (this.isNewName || this.nameList.length === 0)
      return;

    let alert = this.alertCtrl.create({
      title: 'Selecione um produto',
      inputs: [...this.nameList.map((v) => { return { type: 'radio', label: v.text, value: v.text }; }), { type: 'radio', label: '[Novo produto...]', value: 'new' }],
      buttons: [{ text: 'Cancelar', role: 'cancel' },
      {
        text: 'OK',
        handler: data => {
          if (data === 'new') {
            this.isNewName = true;
            this.nameText = 'Informe o novo produto...';

          }
          else {
            this.product.name = data;
          }

        }
      }]
    });

    alert.present();
  }

  selectUnit() {
    if (this.isNewUnit)
      return;

    let alert = this.alertCtrl.create({
      title: 'Selecione um tipo',
      inputs: [...this.unitList.map((v) => { return { type: 'radio', label: v.text, value: v.text }; }), { type: 'radio', label: '[Nova unidade de medida...]', value: 'new' }],
      buttons: [{ text: 'Cancelar', role: 'cancel' },
      {
        text: 'OK',
        handler: data => {
          if (data === 'new') {
            this.isNewUnit = true;
            this.product.unit = '';
            this.unitText = 'Informe a nova unidade de medida...';
          }
          else {
            this.product.unit = data;
          }

        }
      }]
    });

    alert.present();
  }
}
  //events end
