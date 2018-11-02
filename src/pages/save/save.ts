import { Component } from '@angular/core';
import { NavController, Platform, AlertController, NavParams } from 'ionic-angular';
import { WpProvider } from '../../providers/wp/wp';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Clipboard } from '@ionic-native/clipboard';
import { Toast } from '@ionic-native/toast';
import { Storage } from '@ionic/storage';
import {DetailPage} from '../../pages/detail/detail';
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

	public posts: Array<{  id: number; title: string; category: string; content: string; image: string; date: string; link: string; app_link: string; is_saved: boolean }> = [];

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
		private alertController: AlertController
		) {
		this.posts = [];
		this.wpProvider.getSavePost().then((posts) => {

			this.posts = posts;

			this.postCount = this.posts.length;

			this.isReady = true;
			
		});
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
		this.clipboard.copy(post.title + ' \n ឥឡូវនេះ ទាញយកកម្មវីធី Khmer News Live ដោយឥតគិតថ្លៃ! ដើម្បីភាពស្រួល និងទទួលពត៌មានថ្មីៗ ក្នុងដៃជាប់ជានិច្ច!' + post.app_link);
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
    	
    	this.socialSharing.shareViaFacebook(post.title, null, post.app_link).then(() => {

    	}).catch((err) => {
				
    	});
    }

	ionViewDidLoad() {
		console.log('ionViewDidLoad SavePage');
	}

}
