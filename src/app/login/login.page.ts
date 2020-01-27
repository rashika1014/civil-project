import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators, FormGroup, FormControl }            from '@angular/forms';
import {NavController, ToastController, LoadingController,  }  from '@ionic/angular';
import {Router, NavigationExtras} from '@angular/router';
import { Storage }                                  from '@ionic/storage';
import * as firebase                        from 'firebase';
declare var window;

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
	public email              : any= "";
	public isAdmin            : boolean;
  	public loginForm          : FormGroup;
	public appInfo            : any = {};
  	public fireAuth           : any;
	public otp                : string  = "";
	public verificationId     : string  = "";

	public showVerify         : boolean = false;
	public isLoginWithPhone   : boolean = true;
	public phoneNumber        : any = "";

	public sendCodeBtnDisable : boolean = false;
  	public verifyBtnDisable   : boolean = false;
  	public isLoggedIn         : boolean = false;

  constructor(
    public storage            : Storage,
    private loadingCtrl       : LoadingController,
    private toastCtrl         : ToastController,
	private navCtrl           : NavController,
	private router            : Router,
    public formBuilder        : FormBuilder
  ) 
  {
    this.fireAuth   = firebase.auth();
    this.navCtrl    = navCtrl;
	this.isLoggedIn = false; //Set user loggedIn is false;
	this.storage.set('isAdmin', false);

    this.loginForm = this.formBuilder.group({
		email    : new FormControl('', Validators.required),
		password : new FormControl('', Validators.required)
	});
   }
   
  ngOnInit() {
    var self = this;
  }

  loginUser(event) {
		event.preventDefault();
		// call loginUser in all cases - so as to show errors in email or password,
		// like if entered wrong email or left empty etc..
		this.login(this.loginForm.value.email, this.loginForm.value.password);

		if(this.loginForm.value.email.trim() == "" || this.loginForm.value.password.trim() == "") {
			// return if email or password are empty
			return;
		}
  }
  
  //loginUser, it takes an email and a password, both strings.
  login(email: string, password: string): any {
	var self = this;
	self.isAdmin=false;
    var db = firebase.firestore();
    //Display loader
    self.presentLoading();

    //passing the email & password.
    return this.fireAuth.signInWithEmailAndPassword(email, password)
    .then(function(response) {
      // optionally handle a successful login})
      console.log("response :: " + response);
      //console.log("response :: " + response);
      db.collection('UserCollection').doc(response.user.uid)
      .get().then(function(doc) {
        let userInfo = doc.data();
		localStorage.setItem('isAdmin', 'true');
		self.isAdmin = true;
        //On successful login it�s going to set the rootPage  to be the HomePage
        self.router.navigateByUrl('home').then(data => {
          if(userInfo != null) {
            if(userInfo.name == undefined || userInfo.name == "undefined") {
                userInfo.name = "Guest";
            }
            // self.isLoggedIn = true; //Set user loggedIn is false;
			localStorage.setItem('isAdmin', 'true');
            var msg = 'Hi ' + userInfo.name + '! Welcome back to Goyal land surveyors & consultant';
            self.presentToast(msg);
            setTimeout(function(){
				self.isAdmin = true;
				this.navCtrl.navigateBack('home');
              	// window.location.reload();
            }, 100);
          }

          //Hide loader
        }, (error) => {
          console.log(error);
          //Hide loader
        })
      });
    })
    .catch(function(error: any) {
      // unsuccessful authentication response here});
      console.log("error :: " + error);
      var msg = error.message;
      self.presentToast(msg);
      //console.log("error :: " + error.message);
      //If there is a problem its going to show an alert to the user with the error message.
    });
  }

  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      message: '',
      duration: 2000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();

    console.log('Loading dismissed!');
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

	//we are sending the user to the ResetPasswordPage
	goToSignup(){
		this.navCtrl.navigateForward('signup');
	}

	//we are sending the user to the ResetPasswordPage
	// goToResetPassword(email) {
	// 	this.resetPassword(email);
	// }

	//we are sending the user to the HomePage
	goToHomePage() {
		//this.nav.rootNav.setRoot(HomePage);
		this.navCtrl.navigateBack('home');
	}

	//reset password function that takes an email as a string.
	resetPassword(email): any {
		var self = this;
		/* We are passing that email to:
			this.fireAuth.sendPasswordResetEmail(email) and
			Firebase will take care of the reset login,
			they send an email to your user with a password reset link,
			the user follows it and changes his password without you breaking a sweat.
		*/
		return this.fireAuth.sendPasswordResetEmail(email)
		.then(function() {
			//an alert letting your user know that email was sent.
			//let prompt = self.alertCtrl.create({
			var message = "We just sent you a reset link to your email";
			self.presentToast(message);
			//	buttons: [{text: "Ok"}]
			//	});
			//prompt.present();
		})
		.catch(function(error) {
			/*
				created own errorMessage to show how we can personalize those messages to our users,
				default error messages are great for developers, they let us know what�s going on,
				but we should never show them to our users.
			*/
			var errorMessage: string;
			if(error.code == "auth/invalid-email") {
				errorMessage = "You'll need to write a valid email address";
			}
			else if(error.code == "auth/user-not-found") {
				errorMessage = "That user does not exist";
			}
			else {
				errorMessage = error.message;
			}
			self.presentToast(errorMessage);
		});
	}
	
	//check Mobile No Length
	checkMobileNoLengthFunc(callback, self, number) {
		// enable button
		this.sendCodeBtnDisable = false;
  		this.verifyBtnDisable   = false;
		
	    var mobileNo = Number(number);
	    var mobileSNo = String(number);
	    var integer = Number.isInteger(mobileNo);
	    if(mobileSNo.trim() == ''){
	        self.errMsgPhone = "Number required";
	        callback(false);
	    }
	    if(integer == false && mobileSNo.length < 11){
	        self.errMsgPhone = "Number is not valid";
	        callback(false);
	     } else if(mobileNo == 0 || mobileNo.toString().length != mobileSNo.length){
	        self.errMsgPhone = "Number required";
	        callback(false);
	     } else {
	        self.errMsgPhone = "";
	        callback(true);
	    }
	}
	
	//check Mobile No Length
	checkMobileNoLength(event) {
	    this.checkMobileNoLengthFunc(function(isPhoneNumberValid) {
	    	// console.log(isPhoneNumberValid);
	    }, this, event._value);
	}
	
	send() {
		let self = this;
		// disable button
		this.sendCodeBtnDisable = true;
		// call another function
		this.sendCodeToPhone(self, self.phoneNumber);
	}
	
	verify() {
		// disable button
		this.verifyBtnDisable = true;
		// Case when login with other number - not in phone having app
		var self = this;
		var signInCredential = firebase.auth.PhoneAuthProvider.credential(this.verificationId, this.otp);
		firebase.auth().signInWithCredential(signInCredential).then((userObject) => {
			self.signInUserNow(self, userObject);
		}, (error) => {
			console.log(error);
			//alert("Error(3): " + error);
		});
	}

	signInUserNow(self, userObject) {
		self.userLoggedInSuccess(function(isSucess) {
			if(isSucess) {
				
				var obj = {phoneVerified:true};
				var docRef = firebase.firestore().collection("UserCollection").doc(userObject.uid);
				docRef.update(obj).then(function() {
				    //alert("update successfully");
				});
				//Displaying toast to welcome user for Login!
				var toast = self.toastCtrl.create({
					message: 'Hi ' + userObject.email + '! Welcome back to Vestido',
					duration: 1500,
					position: 'bottom'
				});
				toast.present();
			}
		}, userObject, null);
	}

	openPhoneDialogAndHideOtp() {
		this.otp = "";
		
		// enable button
		this.sendCodeBtnDisable = false;
  		this.verifyBtnDisable   = false;
  	
		this.showVerify = false;
	}
	
	sendCodeToPhone(self, phoneNumber) {
		//check..
		self.checkMobileNoLengthFunc(function(isPhoneNumberValid) {
	    	// console.log(isPhoneNumberValid);
		    if(isPhoneNumberValid) {
		        phoneNumber = "+91" + phoneNumber;
			    window.FirebasePlugin.verifyPhoneNumber(phoneNumber, 120, (credential) => {
					//console.log(credential);
					
					if(credential.verificationId == false) {
						// Case when login with number - having app in phone
						// same phone same app - in a single device
						if(credential.instantVerification) {
							let toast = self.toastCtrl.create({
							    message: 'Sending OTP..',
							    duration: 1500,
							    position: 'bottom'
							});
							toast.present();
							// signin user now..
							/*
							self.signInUserNow(self, {
								uid : credential.uid
							});
							*/
							firebase.auth().signInWithCredential(credential).then((userObject) => {
								self.signInUserNow(self, userObject);
							}, (error) => {
								console.log(error);
								//alert("Error(1): " + error);
							});
						}
					} else {
						let toast = self.toastCtrl.create({
						    message: 'OTP Sent Successfully!',
						    duration: 1500,
						    position: 'bottom'
						});
						toast.present();
						
						// Case when login with other number - not in phone having app
						self.isLoginWithPhone = true;
						self.showVerify = true;
						// ask user to input verificationCode:
						self.verificationId = credential.verificationId;
					}
			    }, (error) => {
			        console.error(error);
					//alert("Error(2): " + error);
			    });
			}
	    }, self, phoneNumber);
	}
}
