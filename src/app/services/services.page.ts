import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-services',
  templateUrl: './services.page.html',
  styleUrls: ['./services.page.scss'],
})
export class ServicesPage implements OnInit {

  constructor(private navCtrl:NavController,) { }

  ngOnInit() {
  }


  openPage(type) {
    this.navCtrl.navigateForward(['servicedetail', {type: type}]);
  }
}
