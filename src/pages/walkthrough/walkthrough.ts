import { Component, ViewChild } from '@angular/core';
import { IonicPage, Slides, NavController, MenuController } from 'ionic-angular';

@IonicPage({
	name: 'page-walkthrough',
	segment: 'walkthrough',
	priority: 'high'
})

@Component({
  selector: 'page-walkthrough',
  templateUrl: 'walkthrough.html',
})
export class WalkthroughPage {
	@ViewChild(Slides) slides: Slides;
  showSkip = true;
  dir: string = 'ltr';

  slideList: Array<any> = [
    {
      title: "Que é o Compare&Poupe?",
      description: "É um app que ajuda você a economizar encontrando e comparando os melhores preços nos estabelecimentos comerciais da sua região.",
      image: "assets/img/logo-compare.png",
    },
    {
      title: "Como funciona?",
      description: "Pesquise pelo nome do produto, marca ou categoria, e obtenha uma lista com os melhores preços na sua região, além de informações adicionais e um mapa interativo de onde comprar.",
      image: "assets/img/logo-compare.png",
    },
    {
      title: "Use e economize!",
      description: "Faça seu cadastro para receber notificações com os melhores preços e promoções na palma da sua mão. Saiba onde economizar antes de sair de casa",
      image: "assets/img/logo-compare.png",
    }
  ];

  constructor(public navCtrl: NavController, public menu: MenuController) {
    this.menu.swipeEnable(false);
    this.menu.enable(false);
  }

  onSlideNext() {
    this.slides.slideNext(300)
  }

	onSlidePrev() {
    this.slides.slidePrev(300)
  }

  onLastSlide() {
  	this.slides.slideTo(3, 300)
  }

  openHomePage() {
  	this.navCtrl.setRoot('page-home');
  }

  openAuthPage() {
    this.navCtrl.setRoot('page-auth');
  }

  ionViewDidLoad() {
  }

}
