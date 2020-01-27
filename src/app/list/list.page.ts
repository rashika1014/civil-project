import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {NavController, LoadingController, ToastController} from '@ionic/angular';
import {Injectable} from '@angular/core';
import * as firebase                  from 'firebase/app';

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit {
	public fireAuth : any;
	public contactUsForm: any;
	private selectedItem: any;
	public items: Array<{ title: string; note: string; icon: string }> = [];
	constructor(public formBuilder : FormBuilder, public toastCtrl : ToastController) {
		//creates a firebase auth reference, now you can get access to all the auth methods with this.fireAuth
		this.fireAuth = firebase.auth();
		// Initialize Cloud Firestore through Firebase
		let db = firebase.firestore();
		this.contactUsForm = formBuilder.group({
			name          : ['', Validators.required],
			email         : ['', Validators.required],
			contactNumber : ['', Validators.required],
			message       : ['', Validators.required]
		})
	}
	ngOnInit() {}

	getDate() {
		return new Date();
	}

 	setContactUs(event) {
		event.preventDefault();
		var self = this;
		
		if((this.contactUsForm.value.name != "") &&
			(this.contactUsForm.value.email != "") &&
			(this.contactUsForm.value.contactNumber != "") &&
			(this.contactUsForm.value.message != "")) 
		{
		//Add ContactUs
		this.addContactUs(
			function(isAdded) {
				if(isAdded) {
					//Category added Successfully
					//1. Clear form fields
					let name          = self.contactUsForm.controls['name'];
					let email         = self.contactUsForm.controls['email'];
					let contactNumber = self.contactUsForm.controls['contactNumber'];
					let message       = self.contactUsForm.controls['message'];
					
					name.setValue("");
					email.setValue("");
					contactNumber.setValue("");
					message.setValue("");
					
					//2. Display Toast Message 
					//Displaying toast to welcome user!
					let	msg = 'Thanks for contacting us! We will get back to you soon.';
          self.presentToast(msg)
					return;
			    // toast.present();
				}
			},
			this.contactUsForm.value.name, 
			this.contactUsForm.value.email, 
			this.contactUsForm.value.contactNumber, 
			this.contactUsForm.value.message);
		} else {
			//Display Toast Message 
			//Displaying toast to welcome user!
      let	msg = 'Please enter your Name, Email, Contact Number and Message.';
          self.presentToast(msg)
      return;
			// toast.present();
		}
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
  
	addContactUs(callback: Function, name: string, email: string, contactNumber: string, message: string): any {
		var self = this;
		
			//Getting current logged in user information:
		var uid = "";
		let user = firebase.auth().currentUser;
		let db = firebase.firestore();
		if(user != null) {
			uid = user.uid;
		}
		db.collection('UserContactUsCollection').add({
			userId        : uid,
			name          : name,
			email         : email,
			contactNumber : contactNumber,
			message       : message,
			isRead        : false,
			isDeleted     : false,
			createDate    : self.getDate(),
			updatedDate   : self.getDate()
		})
		.then(function(docRef) {
			//console.log("Document written with ID: ", docRef.id);
			//Category added Successfully, let's call callback function!
			callback(true);
		})
		.catch(function(error) {
			console.error("Error adding document: ", error);
		});
	}
}
