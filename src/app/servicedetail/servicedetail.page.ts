import { Component, OnInit } from '@angular/core';
import{ ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import {NavController, ToastController, LoadingController,  }  from '@ionic/angular';

@Component({
  selector: 'app-servicedetail',
  templateUrl: './servicedetail.page.html',
  styleUrls: ['./servicedetail.page.scss'],
})
export class ServicedetailPage implements OnInit {
  public type : any;
  constructor(private router :  Router,
    private route: ActivatedRoute,
    private navCtrl           : NavController,) { 
    var self         = this;
    this.type    = this.route.snapshot.params["type"];
  }

  ngOnInit() {
  }

  goToHomePage() {
    this.navCtrl.navigateBack('home');
  }

  goToContactPage() {
    this.navCtrl.navigateForward('list');
  }

}
