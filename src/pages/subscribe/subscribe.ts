import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform} from 'ionic-angular';
import { InAppPurchase } from '@ionic-native/in-app-purchase';

/**
 * Generated class for the SubscribePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-subscribe',
  templateUrl: 'subscribe.html',
})
export class SubscribePage {

	public ios: boolean = false;
  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	private iap: InAppPurchase,
  	private alertController: AlertController,
  	private platform: Platform) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SubscribePage');
    
    

	
  }

	async presentAlert(msg, subtitle) {
		const alert = await this.alertController.create({
			message: msg,
			subTitle: subtitle,
			buttons: ['OK']
		});

		await alert.present();
	}		

	async subscribe(){
		this.iap.getProducts(['INAPP001']).then((products) => {
		   this.iap.subscribe(products[0]['productId']).then((data)=> {
			  	this.presentAlert("SUBSCRIBE", JSON.stringify(data));
			  })
			  .catch((err)=> {
			    this.presentAlert("ERROR SUBSCRIBE", JSON.stringify(err));
			  });
		 }).catch((err) => {
		   this.presentAlert("ERROR QUERY", JSON.stringify(err));
		 });
		
	}



}
