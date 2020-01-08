import { Component } from '@angular/core';
import { IonicPage, NavParams, AlertController, NavController } from 'ionic-angular';
import { UserService } from '../../providers/user-service-rest';
import { User } from '../../models/user';
import { AuthService } from '../../providers/auth-service-rest';
import { MyToast } from '../../toolbox/my-toast';

@IonicPage({
  name: 'page-user-detail',
  segment: 'user/:id'
})

@Component({
  selector: 'page-user-detail',
  templateUrl: 'user-detail.html'
})
export class UserDetailPage {

  private userId: string;
  public user: User;
  public isAuth = false;

  constructor(private authService: AuthService, private navCtrl: NavController, private navParams: NavParams, private myToast: MyToast, private userService: UserService, private alertCtrl: AlertController) {
    this.userId = this.navParams.get('id');
  }

  ionViewWillEnter() {
    this.userService.get(this.userId).subscribe(item => {
      this.user = item;
    });
  }

  ionViewCanEnter() {
    if (this.authService.currentUserValue == null)
      setTimeout(() => { this.navCtrl.goToRoot({}); }, 200);
    return this.authService.currentUserValue != null;
  }

  //methods start

  // methods start

  private toast(message: string) {
    this.myToast.show(message);
  }

  //methods end

  //events start

  onEdit() {
    this.navCtrl.push('page-user-create', { 'id': this.userId });
  }

  onDelete(): void {
    this.alertCtrl.create({
      title: 'Deseja realmente deletar?',
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
          }
        },
        {
          text: 'Ok',
          handler: data => {
            this.userService.delete(this.userId).subscribe(_ => {
              this.toast('Deletado com sucesso!');
              this.navCtrl.pop();
            });
          }
        }]
    })
      .present();
  }

  //events end

}




