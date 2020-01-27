import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Storage }                                  from '@ionic/storage';
import * as firebase                                from 'firebase/app';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public fireAuth     : any;
  public isAdmin          = false;
  public isLoggedIn       = false;
  public userProfile      : any;
  public userId           : any;
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'Contact-Us',
      url: '/list',
      icon: 'list'
    },
    {
      title: 'Gallery',
      url: '/gallery',
      icon: 'images'
    },
    {
      title: 'Services',
      url: '/services',
      icon: 'logo-freebsd-devil'
    },
    {
      title: 'About',
      url: '/about',
      icon: 'person'
    }
  ];

  constructor(
    private storage:Storage,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private toastCtrl:ToastController,
    private navCtrl:NavController,
  ) {
    var self=this;
    this.fireAuth=firebase.auth();
    this.isLoggedIn=false;
    
    this.initializeApp();
    this.storage;
    var self=this;
    if(localStorage.isAdmin == undefined || localStorage.isAdmin == null || localStorage.isAdmin == "false") {
      self.isAdmin = false;
      localStorage.setItem('isAdmin', 'false');
    } else{
      self.isAdmin = true;
      localStorage.isAdmin = localStorage.isAdmin;
      localStorage.setItem('isAdmin', localStorage.isAdmin);
    }


    //self.storage.set('isAdmin', false);
		firebase.auth().onAuthStateChanged((user) => {
			if(user) {
				//If there's a user take him to the home page.
				//self.rootPage = HomePage;
				//self.nav.rootNav.setRoot(ProductCategoryPage);
				self.userId = user.uid;
				//var self = self;
				firebase.firestore().collection('userCollection').doc(user.uid)
				.onSnapshot(function(doc) {
					let userInfo = doc.data();
					self.userProfile = userInfo;

					if(userInfo != null && userInfo != undefined) {
						self.isLoggedIn = true; //Set user loggedIn is true;
						if(userInfo.isAdmin == true) {
							self.isAdmin = true;
							localStorage.setItem('isAdmin', 'true');

							// Get a FCM token
							// subscribe to topic 'admin' - notifications will be recieved by all admins.
							if (platform.is('cordova')) {
							//	self.fcmProvider.getToken('admin');
							}
							//console.log(userInfo);
						}
					} else {
						self.isLoggedIn = false; //Set user loggedIn is false;
						self.storage.set('isAdmin', false);
					}
				});
			} else {
				self.isLoggedIn = false; //Set user loggedIn is false;
        localStorage.setItem('isAdmin', 'false');

			}
		});
  }

  ngOnInit() {
    var self=this;
    if(localStorage.isAdmin == undefined || localStorage.isAdmin == null || localStorage.isAdmin == "false") {
        
      localStorage.setItem('isAdmin', 'false');
    } else{
      localStorage.isAdmin = localStorage.isAdmin;
      localStorage.setItem('isAdmin', localStorage.isAdmin);
    }
  }

  goTOLoginPage() {
    this.navCtrl.navigateForward('login');
  }

  goToQeryPage() {
    this.navCtrl.navigateForward('query');
  }

  goToAddSlides() {
    this.navCtrl.navigateForward('addslides');
  }

  goToGalleryPage() {
    this.navCtrl.navigateForward('gallery');
  }

  logOut() {
    var self=this;
		this.logoutUser().then(() => {
      var msg = 'Logged out';
      self.presentToast(msg);
      localStorage.removeItem('isAdmin');
      self.isAdmin = false;
			//this.nav.rootNav.setRoot(HomePage);
			// this.navCtrl.navigateForward('home');
			setTimeout(function(){
        self.isAdmin = false;
        // window.location.reload();
      }, 100);
		});
  }

  logoutUser(): any {
    localStorage.removeItem('isAdmin');
    return this.fireAuth.signOut();
  }

  async presentToast(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      closeButtonText: 'OK',
      position: 'bottom',
      showCloseButton: true
    });
    toast.present();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
