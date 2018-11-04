import { Component } from '@angular/core';
import { NavController, Platform, AlertController, NavParams } from 'ionic-angular';
import { WpProvider } from '../../providers/wp/wp';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Clipboard } from '@ionic-native/clipboard';
import { Toast } from '@ionic-native/toast';
import { Storage } from '@ionic/storage';
import {DetailPage} from '../../pages/detail/detail';
import {ReportProvider} from '../../providers/report/report';
/**
 * Generated class for the SavePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-save',
  templateUrl: 'save.html',
})
export class SavePage {

	public savedPosts: Array<{  id: number; title: string; category: string; content: string; image: string; date: string; link: string; is_saved: boolean }> = [];

	public isReady: boolean = false;

	public postCount: number = 0;

	constructor(
		public wpProvider: WpProvider,
		public navCtrl: NavController, 
		public navParams: NavParams,
		private platform: Platform,
		private socialSharing: SocialSharing,
		private clipboard: Clipboard,
		private toast: Toast,
		private storage: Storage,
		private alertController: AlertController,
		private report: ReportProvider
		) {
		
	}

	save(post){

		if (this.storage.length()){
			this.storage.get(post.id).then((val) => {
				if (val){
					post.is_saved = false;	
					this.storage.remove(post.id);
				}
				else{
					post.is_saved = true;
					this.storage.set(post.id, JSON.stringify(post));
				}
			});
		}
		else{
			this.storage.set(post.id, JSON.stringify(post));
		}	
		
	}

	copy(post){
		this.clipboard.copy(post.title + ' \n\n' + post.link);
		this.toast.show('Copied...', '1500', 'center').subscribe(
		  toast => {
		    
		  }
		);
	}

	pushDetail(id){
		
		this.navCtrl.push(DetailPage, {
			id: id
		});
	}


	async presentAlert(msg, subtitle) {
		const alert = await this.alertController.create({
			message: msg,
			subTitle: subtitle,
			buttons: ['OK']
		});

		await alert.present();
	}

    shareFacebook(post) {
    	let appName = 'facebook';
    	if (this.platform.is('ios')) {
    		appName = 'com.apple.social.facebook'
    	}
    	
    	this.socialSharing.shareViaFacebook(post.title, null, post.link).then(() => {

    	}).catch((err) => {
				
    	});
    }

	ionViewWillEnter() {
		this.savedPosts = [];
		this.postCount = 0;
		this.wpProvider.getSavePost().then((posts) => {

			this.savedPosts = posts;
			
			this.postCount = this.savedPosts.length;

			this.isReady = true;
			
		}).catch((err) => {
			this.report.sendPostRequest({
				'subject' : 'Error! - Error Save Page Single Post',
				'type' : '',
				'crawl_link' : '',
				'post_link' : '',
				'title' : '',
				'content' : '',
				'iframe' : '',
				'app_link' : '',
				'notification' : '',
				'featured_image' : '',
				'detail_message' : JSON.stringify(err),
			}).then((data) => {
			
			});
		});
	}

}
