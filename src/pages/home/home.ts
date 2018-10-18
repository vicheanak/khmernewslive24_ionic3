import { Component } from '@angular/core';
import { NavController, Platform, AlertController } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';

import { Pro } from '@ionic/pro';


@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {


	public deployChannel = "";
	public isBeta = false;
	public downloadProgress = 0;


	constructor(private platform: Platform, public alertController: AlertController, private socialSharing: SocialSharing, public navCtrl: NavController) {

	}


	async presentAlert(msg) {
		const alert = await this.alertController.create({
			message: msg,
			buttons: ['OK']
		});

		await alert.present();
	}

	async checkChannel() {
		try {
			const res = await Pro.deploy.getConfiguration();
			this.deployChannel = res.channel;
			this.isBeta = (this.deployChannel === 'Beta')
		} catch (err) {
			// We encountered an error.
			// Here's how we would log it to Ionic Pro Monitoring while also catching:

			// Pro.monitoring.exception(err);
		}
	}

	async toggleBeta() {
		const config = {
			channel: (this.isBeta ? 'Beta' : 'Production')
		}

		try {
			await Pro.deploy.configure(config);
			await this.checkChannel();
			await Pro.deploy.sync({updateMethod: 'auto'}); // Alternatively, to customize how this works, use performManualUpdate()
		} catch (err) {
			// We encountered an error.
			// Here's how we would log it to Ionic Pro Monitoring while also catching:

			// Pro.monitoring.exception(err);
		}

	}

	async performManualUpdate() {

    /*
      Here we are going through each manual step of the update process:
      Check, Download, Extract, and Redirect.

      Ex: Check, Download, Extract when a user logs into your app,
        but Redirect when they logout for an app that is always running
        but used with multiple users (like at a doctors office).
        */

        try {
        	const update = await Pro.deploy.checkForUpdate();

        	if (update.available){
        		this.presentAlert("Downloading...");
        		this.downloadProgress = 0;

        		await Pro.deploy.downloadUpdate((progress) => {
        			this.downloadProgress = progress;
        		})
        		await Pro.deploy.extractUpdate();
        		await Pro.deploy.reloadApp();
        	}
        	else{
        		this.presentAlert("No Update!");
        	}
        } catch (err) {
        	// We encountered an error.
        	// Here's how we would log it to Ionic Pro Monitoring while also catching:

        	// Pro.monitoring.exception(err);
        }

    }

    shareOnFacebook() {
    	let appName = 'facebook';
    	if (this.platform.is('ios')) {
    		appName = 'com.apple.social.facebook'
    	}

    	this.socialSharing.shareViaFacebook('Test', null, "www.google.com").then(() => {

    	}).catch((msg) => {

    	});
    }

}
