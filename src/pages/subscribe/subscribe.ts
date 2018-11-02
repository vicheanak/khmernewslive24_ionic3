import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform} from 'ionic-angular';
import { InAppPurchase } from '@ionic-native/in-app-purchase';
import { Storage } from '@ionic/storage';

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
  	private platform: Platform,
  	private storage: Storage) {
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

		this.storage.get('purchased').then((val) => {
			// this.presentAlert("Check Is Subscribe!", JSON.stringify(val));
			if (val){
				let purchased = JSON.parse(val);
				this.iap.consume(purchased.productType, purchased.receipt, purchased.signature)
				.then((data) => {
					this.presentAlert("Thank you", "You're already subscribed!");
				})
				.catch((err) => {
					this.iap.getProducts(['INAPP001']).then((products) => {
						this.iap.subscribe(products[0]['productId']).then((data)=> {
							this.presentAlert("Thank you for subscription", "Enjoy the app without ads");
							this.storage.set("purchased", JSON.stringify(data));
							// transactionId: string, receipt: string, signature: string, productType: string
							// consume(productType, receipt, signature)
						})
						.catch((err)=> {
							
						});
					}).catch((err) => {
						
					});
				});
			}
			else{
				this.iap.getProducts(['INAPP001']).then((products) => {
					this.iap.subscribe(products[0]['productId']).then((data)=> {
						this.presentAlert("Thank you for subscription", "Enjoy the app without ads");
						this.storage.set("purchased", JSON.stringify(data));
					})
					.catch((err)=> {
						
					});
				}).catch((err) => {
					
				});
			}
		});

				
		
	}



}
