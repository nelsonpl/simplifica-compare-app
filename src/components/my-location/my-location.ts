import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from 'ionic-angular';
import { LovService } from '../../providers/lov-service-rest';
import { Lov } from '../../models/lov';
import { MyLocationService } from '../../providers/my-location-service';

@Component({
  selector: 'app-my-location',
  templateUrl: 'my-location.html'
})

export class MyLocationComponent implements OnInit {

  yourLocation: string = "** Selecione **";
  storeCitys: Lov[] = [];

  constructor(private myLocationService: MyLocationService, private lovService: LovService, private locationCtrl: AlertController, private toastCtrl: ToastController) {
  }

  ngOnInit() {
    this.lovService.storeCity().subscribe((citys: Lov[]) => {
      this.storeCitys = citys;
    });

    this.myLocationService.get().then(data => { if (data) this.yourLocation = data; });
  }

  alertLocation() {
    let changeLocation = this.locationCtrl.create({
      title: 'Alterar localização',
      message: "Selecione a cidade.",
      buttons: [
        {
          text: 'Cancelar'
        },
        {
          text: 'Alterar',
          handler: data => {
            this.yourLocation = data;
            this.myLocationService.set(data);
            let toast = this.toastCtrl.create({
              message: 'Localização atualizada com sucesso',
              duration: 3000,
              position: 'top',
              closeButtonText: 'OK',
              showCloseButton: true
            });
            toast.present();
          }
        }
      ]
    });


    if (this.storeCitys.length > 0) {
      this.storeCitys.forEach(item => changeLocation.addInput(
        {
          type: 'radio',
          label: item.text,
          value: item.text
        },
      ));
    }
    else {
      changeLocation.addInput(
        {
          type: 'radio',
          label: 'Carregando...',
          value: 'Carregando...',
          checked: true
        },
      );
    }

    changeLocation.present();
  }

}

