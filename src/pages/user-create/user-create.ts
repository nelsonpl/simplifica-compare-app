import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../models/user';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../providers/user-service-rest';
import { AuthService } from '../../providers/auth-service-rest';

@IonicPage({
  name: 'page-user-create',
  segment: 'user-create/:id'
})

@Component({
  selector: 'page-user-create',
  templateUrl: 'user-create.html'
})
export class UserCreatePage implements OnInit {

  public user: User = new User();
  public onForm: FormGroup;
  public userId: string;

  constructor(private _fb: FormBuilder, private userService: UserService, private authService: AuthService, private navCtrl: NavController, private navParams: NavParams) {
    this.userId = this.navParams.get('id');
  }

  ngOnInit() {
    this.onForm = this._fb.group({
      type: ['', Validators.compose([Validators.required])],
      name: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required])],
    });

    if (this.userId)
      this.userService.get(this.userId).subscribe(item => {
        this.user = item;
      });
  }

  ionViewCanEnter() {
    return this.authService.currentUserValue != null;
  }

  //methods start
  //methods end

  //events start
  onSubmit() {
    this.userService.save(this.user)
      .subscribe(data => {
        this.navCtrl.pop();
      }
      );
  }
}
  //events end
