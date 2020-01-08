import { Component, OnInit } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service-rest';
import { User } from '../../models/user';
import { UserService } from '../../providers/user-service-rest';

@IonicPage({
  name: 'page-my-account',
  segment: 'my-account'
})

@Component({
  selector: 'page-my-account',
  templateUrl: 'my-account.html'
})
export class MyAccountPage implements OnInit {

  myAccount: User = new User();

  constructor(private authService: AuthService, private userService: UserService) {
  }

  ngOnInit() {
    this.authService.currentUser.subscribe(session => {
      if (!session)
        return;

      this.userService.get(session.userId).subscribe(user => this.myAccount = user);
    });
  }

  ionViewCanEnter() {
    return this.authService.currentUserValue != null;
  }

}
