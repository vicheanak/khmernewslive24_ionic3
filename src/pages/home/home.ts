import { Component } from '@angular/core';
import { NavController, Platform, AlertController, NavParams } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { WpProvider } from '../../providers/wp/wp';
import {DetailPage} from '../../pages/detail/detail';
import {ContactPage} from '../../pages/contact/contact';
import { BranchIo } from '@ionic-native/branch-io';
import { Clipboard } from '@ionic-native/clipboard';
import { Toast } from '@ionic-native/toast';

import { Pro } from '@ionic/pro';
import { Storage } from '@ionic/storage';

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {


	public deployChannel = "";
	public isBeta = false;
	public downloadProgress = 0;
	public categoryId: any = "";
	public pageTitle: any = "";
	
	public posts: Array<{  id: number; title: string; category: string; content: string; image: string; date: string; link: string; app_link: string; is_saved: boolean }> = [];
	public morePagesAvailable: Boolean;
	private page: number = 1;
	public isReady: boolean = false;
	

	constructor(private toast: Toast, 
		private clipboard: Clipboard, 
		private branch: BranchIo, 
		private wpProvider: WpProvider, 
		public navParams: NavParams, 
		private platform: Platform, 
		public alertController: AlertController, 
		private socialSharing: SocialSharing, 
		public navCtrl: NavController,
		private storage: Storage) {

		this.categoryId = navParams.get('categoryId');
		
		let arrayTitle = [
		{id: null, title: 'Khmer News Live 24'},
		{id: 2, title: 'ពត៌មាន Live'},
		{id: 3, title: 'សិល្បះ & កំសាន្ត'},
		{id: 4, title: 'សុខភាព & ជីវិត'},
		{id: 1, title: 'យល់ដឹង'},
		{id: 6, title: 'ប្លែកៗ'},
		{id: 16, title: 'កីឡា'},
		{id: 17, title: 'បច្ចេកវិទ្យា'}
		];

		for (let i = 0; i < arrayTitle.length; i ++){
			if (this.categoryId == arrayTitle[i]['id']){
				this.pageTitle = arrayTitle[i]['title'];
			}
		}
		
		this.posts = [];
		this.wpProvider.refresh(this.categoryId).then((posts) => {

			for(let post of posts){
				this.posts.push(post);
			}
			this.isReady = true;
		});


		// this.syncing();

	}

	save(post){

		this.storage.get('saved_articles').then((val) => {
			// this.storage.set('name', 'Max');
			// JSON.stringify()

			let prev_vals = JSON.parse(val);
			let new_vals = [];
			if (prev_vals){
				// or pop or push;
				let is_matched = false;
				for(let i = 0; i < prev_vals.length; i ++){
					if (prev_vals[i] == post.id){
						is_matched = true;
					}
				}
				if (is_matched){
					prev_vals = prev_vals.filter(function(ele){
				       return ele != post.id;
				   	});
				   	post.is_saved = false;
				   	this.presentAlert('article EXIST - POP ID', JSON.stringify(prev_vals));
				}
				else{
					prev_vals.push(post.id);
					post.is_saved = true;
					this.presentAlert('article NOT EXIST - PUSH ID', JSON.stringify(prev_vals));
				}
				this.storage.set('saved_articles', JSON.stringify(prev_vals));
				
			}
			else{
				new_vals.push(post.id);
				this.presentAlert('article NEVER EXIST - PUSH ID', JSON.stringify(new_vals));
				post.is_saved = true;
				this.storage.set('saved_articles', JSON.stringify(new_vals));
			}

			
		});
		
	}
	

	doRefresh(refresher){
		this.page = 1;
		this.posts = [];
		this.wpProvider.refresh(this.categoryId).then((posts) => {
			for(let post of posts){
				this.posts.push(post);
			}
			refresher.complete();
		});		
	}

	doInfinite(infiniteScroll) {
		let loading = true;
		let posts = [];

		this.page++;

		this.wpProvider.getPosts(this.page, this.categoryId).then((posts) => {
			
			for(let post of posts){
				

				if(!loading){
					infiniteScroll.complete();
				}

				this.posts.push(post);
				loading = false;
			}
		});
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

	async checkChannel() {
		try {
			const res = await Pro.deploy.getConfiguration();
			this.deployChannel = res.channel;
			this.isBeta = (this.deployChannel === 'Beta')
		} catch (err) {
			// We encountered an error.
			// Here's how we would log it to Ionic Pro Monitoring while also catching:

			Pro.monitoring.exception(err);
		}
	}

	async syncing() {
		const config = {
			channel: 'Master'
		}

		try {
			await Pro.deploy.configure(config);
			await this.checkChannel();
			// await Pro.deploy.sync({updateMethod: 'auto'}); // Alternatively, to customize how this works, use performManualUpdate()
		} catch (err) {
			// We encountered an error.
			// Here's how we would log it to Ionic Pro Monitoring while also catching:

			Pro.monitoring.exception(err);
		}

	}


	copy(post){
		this.clipboard.copy(post.title + ' - ឥឡូវនេះ ទាញយកកម្មវីធី Khmer News Live ដោយឥតគិតថ្លៃ! ដើម្បីភាពស្រួល និងទទួលពត៌មានថ្មីៗ ក្នុងដៃជាប់ជានិច្ច!' + post.app_link);
		this.toast.show('Copied...', '1500', 'center').subscribe(
		  toast => {
		    
		  }
		);
	}

    shareFacebook(post) {
    	let appName = 'facebook';
    	if (this.platform.is('ios')) {
    		appName = 'com.apple.social.facebook'
    	}
    	
    	this.socialSharing.shareViaFacebook(post.title, null, post.app_link).then(() => {

    	}).catch((err) => {
			Pro.monitoring.exception(err);		
    	});
    }

}
