import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { Product } from '../../models/product';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LovService } from '../../providers/lov-service-rest';
import { Lov } from '../../models/lov';
import { ProductIndicationService } from '../../providers/product-indication-service-rest';
import { AuthService } from '../../providers/auth-service-rest';

@IonicPage({
  name: 'page-product-indication-create',
  segment: 'product-indication-create'
})

@Component({
  selector: 'page-product-indication-create',
  templateUrl: 'product-indication-create.html'
})
export class ProductIndicationCreatePage implements OnInit {

  public product: Product = new Product();
  public onForm: FormGroup;
  public uploadedFiles: Array<File>;
  public stateList: Lov[] = [];
  public cityList: Lov[];

  constructor(private _fb: FormBuilder, private lovService: LovService, private service: ProductIndicationService, private authService: AuthService, private navCtrl: NavController) {
  }

  ngOnInit() {
    this.onForm = this._fb.group({
      type: ['', Validators.compose([Validators.required])],
      brand: ['', Validators.compose([Validators.required])],
      name: ['', Validators.compose([Validators.required])],
      storeName: ['', Validators.compose([Validators.required])],
      storeState: ['', Validators.compose([Validators.required])],
      storeCity: ['', Validators.compose([Validators.required])],
      storeAddress: ['', Validators.compose([Validators.required])],
      volume: '',
      price: '',
      unit: '',
    });

    this.stateList = this.lovService.state();
  }

  ionViewCanEnter() {
    return this.authService.currentUserValue != null;
  }

  //methods start
  //methods end

  //events start
  onSubmit() {
    this.service.save(this.product)
      .subscribe((data: { id: string, message: string }) => {
        if (data && this.uploadedFiles) {
          let formData = new FormData();
          for (var i = 0; i < this.uploadedFiles.length; i++) {
            const name = `${data.id}.png`;
            formData.append("uploads", this.uploadedFiles[i], name);
          }
          this.service.saveImg(data.id, formData).subscribe(_ => this.navCtrl.pop());
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

  defaultImg(event): void {
    const target = event.target;
    target.src = '../../assets/img/no-image/default.png';
  }

  cityBuild(state: string) {
    if (state)
      this.cityList = this.lovService.city(state);
  }
}
  //events end
