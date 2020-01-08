import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { IonicPage, NavController, AlertController, MenuController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service-rest';
import { UserService } from '../../providers/user-service-rest';
import { User } from '../../models/user';
import { AccesscodeService } from '../../providers/accesscode-service-rest';
import { SsoService } from '../../services/sso-service';
import { MyToast } from '../../toolbox/my-toast';

@IonicPage({
  name: 'page-auth',
  segment: 'auth',
  priority: 'high'
})

@Component({
  selector: 'page-auth',
  templateUrl: 'auth.html'
})
export class AuthPage implements OnInit {
  public onLoginForm: FormGroup;
  public onRegisterForm: FormGroup;
  email: string = "";
  password: string = "";
  auth: string = "login";

  constructor(private ssoService: SsoService, private accesCodeService: AccesscodeService, private _fb: FormBuilder, public navCtrl: NavController, public forgotCtrl: AlertController, public menu: MenuController, public toastCtrl: MyToast, public authService: AuthService, public userService: UserService) {
    // this.menu.swipeEnable(false);
    // this.menu.enable(false);
  }

  ngOnInit() {
    this.authService.logout();
    this.onLoginForm = this._fb.group({
      email: ['', Validators.compose([
        Validators.required
      ])],
      password: ['', Validators.compose([
        Validators.required
      ])]
    });

    this.onRegisterForm = this._fb.group({
      fullName: ['', Validators.compose([
        Validators.required
      ])],
      email: ['', Validators.compose([
        Validators.required
      ])],
      emailConfirm: ['', Validators.compose([
        Validators.required
      ])],
      password: ['', Validators.compose([
        Validators.required
      ])],
      passwordConfirm: ['', Validators.compose([
        Validators.required
      ])]
    });
  }

  // go to register page
  // register() {
  //   this.nav.setRoot(RegisterPage);
  // }

  // login and go to home page
  login() {
    this.authService.login(this.onLoginForm.value['email'], this.onLoginForm.value['password'])
      .subscribe(data => {
        if (data)
          this.navCtrl.setRoot('page-home');
      });

  }

  register() {
    const name = this.onRegisterForm.value['fullName'],
      email = this.onRegisterForm.value['email'],
      emailConfirm = this.onRegisterForm.value['emailConfirm'],
      password = this.onRegisterForm.value['password'],
      passwordConfirm = this.onRegisterForm.value['passwordConfirm'];

    if (email != emailConfirm) {
      this.alert('Confirmação de e-mail errada.');
      return;
    }

    if (password.length < 6) {
      this.alert('Senha deve ter 6 (seis) ou mais caracteres.');
      return;
    }

    if (password != passwordConfirm) {
      this.alert('Confirmação de senha errada.');
      return;
    }

    const registerUser = new User();
    registerUser.name = name;
    registerUser.email = email;
    registerUser.password = password;

    this.userService.create(registerUser)
      .subscribe(user => {
        if (user) {
          this.onRegisterForm.value['fullName'] = '';
          this.onRegisterForm.value['email'] = '';
          this.onRegisterForm.value['emailConfirm'] = '';
          this.onRegisterForm.value['password'] = '';
          this.onRegisterForm.value['passwordConfirm'] = '';
          this.auth = 'login';
          this.alert('Usuário criado com sucesso.');
        }
      });
  }

  private alert(message) {
    this.toastCtrl.show(message);
  }

  openHomePage() {
    this.navCtrl.setRoot('page-home');
  }

  forgotPass() {
    let forgot = this.forgotCtrl.create({
      title: 'Esqueceu senha?',
      message: "Informe seu e-mail para receber o código para resetar a senha.",
      inputs: [
        {
          name: 'email',
          placeholder: 'Email',
          type: 'email'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
          }
        },
        {
          text: 'Send',
          handler: data => {
            this.accesCodeService.newCode(data.email).subscribe(data => {
              this.toastCtrl.show('Acesse seu e-mail e valide o codigo acesso.');
            });
          }
        }
      ]
    });
    forgot.present();
  }

  onRegisterAccesscode() {
    this.navCtrl.push('page-acesscode');
  }

  async loginGoogle() {
    const googleUser = await this.ssoService.googleLogin();
    if (!googleUser) {
      this.toastCtrl.show('Ops, tente novamente mais tarde!');
      return;
    }

    this.authService.loginGoogle(googleUser)
      .subscribe(data => {
        if (data)
          this.navCtrl.setRoot('page-home');
      });

  }

}
