import { Component, OnInit } from '@angular/core';
import * as firebase         from 'firebase/app';

@Component({
  selector: 'app-query',
  templateUrl: './query.page.html',
  styleUrls: ['./query.page.scss'],
})
export class QueryPage implements OnInit {
  public userRequestList:any=[];
  constructor() { 
    this.getUserRequest();
  }

  ngOnInit() {

    // this.getUserRequest();
  }

  getUserRequest() {
		var self = this;
		this.getRequest(function(isSuccess, snapshotArray) {
			if(isSuccess) {
				self.userRequestList = snapshotArray;
			}
			
		}, false);
  }
  
  getRequest(callback: Function, next): any {
		var self = this;
    var query : any;
    var db = firebase.firestore();
		query = db.collection('UserContactUsCollection').orderBy('updatedDate', 'desc');
		if(next == false) {
			query.onSnapshot(function(querySnapshot) {
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
				// ...
				console.log("Error getting document:", error);
				// callback execution
				callback(false, null);
			});
		}
  }
  
  // change timestamp to local date-time
  timestampToDateTime1 = function(timestamp) {
    let date = new Date(timestamp.seconds * 1000);
    let hours="";
    let minutes;
    if(date.getMinutes() < 10) {
        minutes = "0"+minutes;
    } else {
      minutes = date.getMinutes()
    }
    if(date.getHours() > 12) {
        // hours = date.getHours() - 12;
        hours = "0"+(date.getHours() - 12);
        var timeZone = " PM";
    } else {
        // hours = hours;
        if(date.getHours() == 12) {
            var timeZone = " PM";
        } else {
            var timeZone = " AM";
        }
    }
    //return  hours + ":" + minutes + timeZone + ", " + date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
    return  hours + ":" + minutes + timeZone + ", " + date.toDateString();
  }


}
