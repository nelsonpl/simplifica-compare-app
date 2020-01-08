import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../providers/auth-service-rest';
import { Message } from '../../models/message';
import { MessageService } from '../../providers/message-service-rest';

@IonicPage({
  name: 'page-message-create',
  segment: 'message-create/:id'
})

@Component({
  selector: 'page-message-create',
  templateUrl: 'message-create.html'
})
export class MessageCreatePage implements OnInit {

  public message: Message = new Message();
  public onForm: FormGroup;
  public messageId: string;

  constructor(private _fb: FormBuilder, private messageService: MessageService, private authService: AuthService, private navCtrl: NavController, private navParams: NavParams) {
    this.messageId = this.navParams.get('id');
  }

  ionViewCanEnter() {
    if (this.authService.currentUserValue == null)
      setTimeout(() => { this.navCtrl.goToRoot({}); }, 200);
    return this.authService.currentUserValue != null;
  }

  ngOnInit() {
    this.onForm = this._fb.group({
      title: ['', Validators.compose([Validators.required])],
      notification: ['', Validators.compose([Validators.required])],
      to: 'all'
    });

    if (this.messageId)
      this.messageService.get(this.messageId).subscribe(item => {
        this.message = item;
      });
  }

  //methods start
  //methods end

  //events start
  onSubmit() {
    this.messageService.save(this.message).subscribe(data => this.navCtrl.pop());
  }
  //events end
}
