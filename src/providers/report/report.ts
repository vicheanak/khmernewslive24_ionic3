import { Injectable } from '@angular/core';
import {AlertController } from 'ionic-angular';
import { HTTP } from '@ionic-native/http';

// import { Http, Headers, RequestOptions } from '@angular/common/http';

/*
  Generated class for the ReportProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ReportProvider {

	public data: any;
  constructor(public http: HTTP, public alertCtrl: AlertController) {
    console.log('Hello ReportProvider Provider');
  }


  async presentAlert(msg, subtitle) {
		const alert = await this.alertCtrl.create({
			message: msg,
			subTitle: subtitle,
			buttons: ['OK']
		});

		await alert.present();
	}

  sendPostRequest(data) {
    	this.presentAlert('title', 'send');
		return new Promise(resolve => {
			let postData = {
			'subject' : data.subject,
			'type' : data.type,
			'crawl_link' : data.crawl_link,
			'post_link' : data.post_link,
			'title' : data.title,
			'content' : data.content,
			'iframe' : data.iframe,
			'app_link' : data.app_link,
			'notification' : data.notification,
			'featured_image' : data.featured_image,
			'detail_message' : data.detail_message,
		}
		
	     this.http.post('https://www.khmernewslive24.com/webhook/send_email.php', postData, {})
	        .then(data => {
	        	this.presentAlert('Successuflly Sent', data);
	          	this.data = data;
	          	resolve(this.data);
	        }).catch((err) => {
	        	this.presentAlert('Erro sent email', err);
	        });
	    });
    
	}
}
