import { Component } from '@angular/core';
import { Platform, NavController, ToastController, AlertController } from '@ionic/angular';
import * as firebase from 'firebase';
import 'firebase/firestore';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public isAdmin : boolean;
  public slides = [];

  sliderOpts = {
		autoplay: true,
		speed: 1000,
		autoplayDisableOnInteraction: false,
		zoom: {
		  maxRatio: 5
		}
  };
  
  constructor(public navCtrl : NavController) {
    var self= this;
    console.log('23333333333333')
    if(localStorage.isAdmin == undefined || localStorage.isAdmin == null || localStorage.isAdmin == "false") {
      self.isAdmin=false;  
      localStorage.setItem('isAdmin', 'false');
    } else{
      self.isAdmin=true;
      localStorage.isAdmin = localStorage.isAdmin;
      localStorage.setItem('isAdmin', localStorage.isAdmin);

    }
  }

  ngOnInit() {
    var self= this;
    console.log('555555555555555')
    if(localStorage.isAdmin == undefined || localStorage.isAdmin == null || localStorage.isAdmin == "false") {
      self.isAdmin=false;
      localStorage.setItem('isAdmin', 'false');
    } else{
      self.isAdmin=true;
      localStorage.isAdmin = localStorage.isAdmin;
      localStorage.setItem('isAdmin', localStorage.isAdmin);

    }

    var self = this;
    //Fetching HomeSlides
		self.getHomeSlides(function(isSuccess, snapshotArray) {
			//console.log(snapshot);
			self.slides = snapshotArray;
			//setting iframe src in Angular2 without causing `unsafe value` exception
			self.slides.forEach(function(slide) {
				for (let key in slide) {
					let value = slide[key];
					// if(value == "video") {
					// 	//Adding player settings
					// 	let newSrc = "https://www.youtube.com/embed/" + slide['src'] + "?enablejsapi=1&rel=0&autoplay=0&showinfo=0&controls=1";
					// 	slide["safeSrc"] = this.sanitizer.bypassSecurityTrustResourceUrl(newSrc);
					// }
				}
			});
			self.slides = self.shuffle(self.slides);
			//}
		});
  }

  getHomeSlides(callback: Function): any {
		firebase.firestore().collection('HomeSlideCollection')
		.onSnapshot(function(querySnapshot) {
			var snapshotArray = [];
			querySnapshot.forEach(function(doc) {
				// doc.data() is never undefined for query doc snapshots
				//console.log(doc.id, " => ", doc.data());
				var object = doc.data();
				// set id in object
				object['id'] = doc.id;
				// push in array of product objects
				snapshotArray.push(object);
			});
			// callback execution
			callback(true, snapshotArray);
		}, function(error) {
			// callback execution
			callback(false, null);
		});
	}

  shuffle(array: any) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

  doRefresh(event) {
		console.log('Begin async operation', event);
		//this.nav.setRoot('HomePage');
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }
  
  onSlideChanged() {
		//this.pauseVideo();
		var iframeM:any = document.getElementsByTagName("iframe");
		for (let ifr of iframeM) {
			let iframe  = ifr.contentWindow;
			iframe.postMessage('{"event":"command","func":"' + "stopVideo" + '","args":""}', '*');
		}
  }
  
  goToContactPage() {
    this.navCtrl.navigateForward('list');
  }

  openPage(type) {
    this.navCtrl.navigateForward(['servicedetail', {type: type}]);
  }
}
