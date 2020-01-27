import { Component, OnInit } from '@angular/core';
import { NgProgress, NgProgressRef }             from 'ngx-progressbar';
import {NavController, AlertController, ToastController} from '@ionic/angular';

import * as firebase         from 'firebase/app';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.page.html',
  styleUrls: ['./gallery.page.scss'],
})
export class GalleryPage implements OnInit {
  public submitDisabled  : boolean = false;
  public currentSrc     : any;
  public images         : any =[];
  public progressRef     : NgProgressRef;
  public isAdmin         : boolean = false;
  constructor(private ngProgress: NgProgress,
    private alertCtrl : AlertController,
    private toastCtrl  : ToastController,) {
    this.progressRef = this.ngProgress.ref('myProgress');
    var self=this;
    if(localStorage.isAdmin == undefined || localStorage.isAdmin == null || localStorage.isAdmin == "false") {
      self.isAdmin = false;
      localStorage.setItem('isAdmin', 'false');
    } else{
      self.isAdmin = true;
      localStorage.isAdmin = localStorage.isAdmin;
      localStorage.setItem('isAdmin', localStorage.isAdmin);
    }
  }

  ngOnInit() {
    var self=this;
    if(localStorage.isAdmin == undefined || localStorage.isAdmin == null || localStorage.isAdmin == 'false') {
      self.isAdmin = false;
      localStorage.setItem('isAdmin', 'false');
    } else{
      self.isAdmin = true;
      localStorage.isAdmin = localStorage.isAdmin;
      localStorage.setItem('isAdmin', localStorage.isAdmin);
    }
    //Fetching HomeSlides
		this.getGalleryImages();
  }

  getDate() {
		return new Date();
	}
  slideId     = null;


  getGalleryImages() {
    var self = this;
		this.getSlides(function(isSuccess, snapshotArray) {
			//console.log(snapshot);
			self.images = snapshotArray;
			
			//setting iframe src in Angular2 without causing `unsafe value` exception
			self.images.forEach(function(slide) {
				for (let key in slide) {
					let value = slide[key];
					// if(value == "video") {
					// 	//Adding player settings
					// 	let newSrc = "https://www.youtube.com/embed/" + slide['src'] + "?enablejsapi=1&rel=0&autoplay=0&showinfo=0&controls=1";
					// 	slide["safeSrc"] = self.sanitizer.bypassSecurityTrustResourceUrl(newSrc);
					// }
				}
			});
		});
  }
  
  getSlides(callback){
    firebase.firestore().collection('GalleryCollection')
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

  onImageFileChange() {
		var self = this;
		var slideImgBtn: any = document.getElementById("slideImg");
		var file = null;
		
		if(slideImgBtn != null) {
			self.submitDisabled = true;
			//Get file
			file = slideImgBtn.files[0];
			if(file !== undefined) {
				/** request started */
				this.progressRef.start();
				this.addGalleryImage(function(downloadURL) {
				self.currentSrc     = downloadURL;
					/** request started */
					self.progressRef.complete();
					self.submitDisabled = false;
				}, self.slideId, file);
			} else {
			
			}
		}
  }

  addGalleryImage(callback: any, slideId: string, file: File) {
		if(file != null) {
			if(file != undefined) {
				//Create a storage ref
				if(slideId == undefined || slideId == "") {
					slideId = firebase.database().ref('/gallery').push().key;
				}
				
				var imageStorageRef = firebase.storage().ref().child('gallery/' + slideId);

				//Uplaod file
				var task = imageStorageRef.put(file);

				//update progress bar
				task.on('state_changed',
					function progress(snapshot) {
						//var percentage = (snapshot.bytesTransferred/snapshot.totalBytes) * 100;
						//console.log(percentage);
						//uploader.value = percentage;
					},

					function error(err) {
					//console.log("File upload error: " + err);
					},

					function complete() {
						// Upload completed successfully, now we can get the download URL
						task.snapshot.ref.getDownloadURL().then(function(downloadURL) {
							//console.log('File available at', downloadURL);
							callback(downloadURL);
					  });
					}
				)
			}
		}
  }

  addImage(event) {
		event.preventDefault();
		var self = this;
		//Get Elements
		//var uploader    = document.getElementById("uploader");
		var slideImgBtn: any = document.getElementById("slideImg");
		var file = null;

		if(slideImgBtn != null) {
			//Get file
			file = slideImgBtn.files[0]; 
			if(file == undefined) {
				file = self.currentSrc;
			}
		}
		
		if(file != undefined) {
			this.submitDisabled = true;
      //Add Slider
      firebase.firestore().collection('GalleryCollection').add({
				admin     : localStorage.isAdmin,
				src         : self.currentSrc,
				isDeleted   : false,
				createDate  : self.getDate(),
				updatedDate: self.getDate()
			})
			.then(function(docRef) {
        self.presentToast('IMAGE ADDED SUCCESSFULLY');
				self.submitDisabled = false;
			})
			.catch(function(error) {
				console.error("Error adding document: ", error);
				self.presentToast('PLEASE ADD IMAGE FOR THE GALLERY');
			});
		} else {
			//Display Toast Message
			//Displaying toast to welcome user!
        self.presentToast('PLEASE ADD IMAGE FOR THE GALLERY');
		}
  }

  removeImage(slideId) {
		var self = this;
		function removeConfirmed() {
      firebase.firestore().collection('GalleryCollection').doc(slideId).delete()
      .then(function() {
        self.presentToast('IMAGE REMOVED SUCCESSFULLY');
      }).catch(function(error) {
        // error;
      });
		}

		/*Confirm first, if user really wants to remove product!
		    Arguments: title, message, AgreeButtonText, DisAgreeButtonText
		               , callback function on removeConfirmed, callback function on not removed
		*/
		this.showConfirmDialog("Are you Sure?",
			"Do you agree to remove this image?",
			"Cancel", "Yes. Remove now!",
			removeConfirmed, function(){});

  }
  
  //Show Confirm Dialog
  async	showConfirmDialog(title       : string, message            : string, disAgreeBtnText: string, agreeBtnText: string,
    agreeCallback : Function, disAgreeCallback : Function) {
      let alert = await this.alertCtrl.create({
        header   :   title,
        message : message,
        buttons : [

        {
          cssClass: "buttoncss",
          text: disAgreeBtnText,
            handler: () => {
              //console.log('Disagree clicked');
              disAgreeCallback();
          }
        },
        {
          cssClass: "buttoncss",
          text: agreeBtnText,
          handler: () => {
            //console.log('Agree clicked');
            agreeCallback();
          }
      },]
    });
    await alert.present();
  }

  async presentToast(msg:string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
			position: 'bottom',
			showCloseButton: true,
      closeButtonText: 'OK'
    });
    toast.present();
  }

}
