import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AppAvailability } from '@ionic-native/app-availability';
import { CallNumber } from '@ionic-native/call-number';

/**
 * Generated class for the ContactPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


 @Component({
 	selector: 'page-contact',
 	templateUrl: 'contact.html',
 })
 export class ContactPage {

 	public logo = "../assets/imgs/logo.png";


 	constructor(
 		private callNumber: CallNumber, 
 		private platform: Platform, 
 		private appAvailability: AppAvailability, 
 		private iab: InAppBrowser, 
 		public navCtrl: NavController, 
 		public navParams: NavParams,
 		private alertCtrl: AlertController) {



 	}

 	launchExternalApp(iosSchemaName: string, androidPackageName: string, appUrl: string, httpUrl: string, username: string) {
 		let app: string;
 		if (this.platform.is('ios')) {
 			app = iosSchemaName;
 		} else if (this.platform.is('android')) {
 			app = androidPackageName;
 		} else {
 			let browser = this.iab.create(httpUrl + username, '_system');
 			return;
 		}
 		try{
 			this.appAvailability.check(app).then(
 			() => { // success callback
 				let browser = this.iab.create(appUrl + username, '_system');
 			},
 			() => { // error callback
 				let browser = this.iab.create(httpUrl + username, '_system');
 			}
 			);	
 		}catch(err){
 			this.presentAlert('Error Laucnh External', err);
 		}
 		
 	}

 	async presentAlert(msg, subtitle) {
 		const alert = await this.alertCtrl.create({
 			message: msg,
 			subTitle: subtitle,
 			buttons: ['OK']
 		});

 		await alert.present();
 	}

 	call(number: string){
 		try{
 			this.callNumber.callNumber(number, true)
	 		.then(res => console.log('Launched dialer!', res))
	 		.catch(err => console.log('Error launching dialer', err));
 		}catch(err){
 			this.presentAlert('Call', err);
 		}
 		
 	}


 	openFacebook(username: string) {
 		this.launchExternalApp('fb://', 'com.facebook.katana', 'fb://page/', 'https://www.facebook.com/', username);
 	}

 	ionViewDidLoad() {
 		console.log('ionViewDidLoad ContactPage');
 	}

 	openBrowser(){
 		this.iab.create('https://www.khmernewslive24.com/');
 	}

 }
