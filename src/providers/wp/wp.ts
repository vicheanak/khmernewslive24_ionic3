import WPAPI from 'wpapi';
import { Injectable } from '@angular/core';
import { Pro } from '@ionic/pro';
import {AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';


/*
  Generated class for the WpProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/


interface Post {
	id: number,
	title: string,
	category: string,
	content: string,
	image: string,
	date: string,
	link: string
}

@Injectable()
export class WpProvider {

	public posts: Array<{  id: number; title: string; category: string; content: string; image: string; date: string; link: string, app_link: string, is_saved: boolean}> = [];
	private wp: any = new WPAPI({ endpoint: 'https://www.khmernewslive24.com/?_embed&rest_route=/' });
	public post: any;
	public keys:  any = new Array();

	public saved_articles: any = [];

	constructor(public alertCtrl: AlertController, private storage: Storage) {
		console.log('Hello WpProvider Provider');
	}

	refresh(category_id): Promise<any[]> {


		return new Promise((resolve, reject) => {
			this.wp.posts().perPage(20).categories(category_id).then( (data) => {

				this.posts = [];
				let posts = [];
				
				this.storage.ready().then(() => {
					this.storage.keys().then((val) => {
						
						this.keys = [];	
						


						for (let i = 0; i < val.length; i ++){
							this.keys.push(val[i]);
						}

						

						for (let i = 0; i < data.length; i++) {
							let img = '';

							if (data[i]._embedded['wp:featuredmedia']){
								img = data[i]._embedded['wp:featuredmedia']['0'].source_url;
							}
							
							let app_link = data[i]['app_link'];

							// let content = data[i]['the_content'];
							let content = '';
							// if (data[i]['original_content'].length){
								// content = data[i]['original_content'][0];
							// }

							let post = {
								id: data[i]['id'],
								title: data[i]['title'].rendered,
								category: data[i]['category_name'][0],
								content: content,
								image: img,
								date: data[i].date,
								link: data[i].link,
								app_link: app_link,
								is_saved: false
							}
							

							
							for (let i = 0; i < this.keys.length; i ++){
								// this.presentAlert('key id true/false ', this.keys[i] + " == " + data[i]['id']);
								if (this.keys[i] == data[i]['id']){
									
									post.is_saved = true;
									break;
								}
							}
							
							posts.push(post);
							this.posts.push(post);	
							

							

						}

						resolve(posts);

					});
				})


			}).catch(function( err ) {
				// handle error
			});
		});
	}

	getPosts(page, category_id = null): Promise<any[]> {
		return new Promise((resolve, reject) => {
			this.wp.posts().perPage(20).page(page).categories(category_id).then( (data) => {
				
				
				this.storage.keys().then((val) => {


					let posts = [];

					this.keys = [];	
						
					for (let i = 0; i < val.length; i ++){
						this.keys.push(val[i]);
					}

					for (let i = 0; i < data.length; i++) {
						let img = '';

						if (data[i]._embedded['wp:featuredmedia']){
							img = data[i]._embedded['wp:featuredmedia']['0'].source_url;
						}

						let app_link = data[i]['app_link'];
						
						// let content = data[i]['the_content'];
						let content = '';
						// if (data[i]['original_content'].length){
							// content = data[i]['original_content'][0];
						// }



						let is_saved = false;

						let post = {
							id: data[i]['id'],
							title: data[i]['title'].rendered,
							category: data[i]['category_name'][0],
							content: content,
							image: img,
							date: data[i].date,
							link: data[i].link,
							app_link: app_link,
							is_saved: is_saved
						};


						for (let i = 0; i < this.keys.length; i ++){
							// this.presentAlert('key id true/false ', this.keys[i] + " == " + data[i]['id']);
							if (this.keys[i] == data[i]['id']){
								
								post.is_saved = true;
								break;

							}
						}


						posts.push(post);

						this.posts.push(post);

					}
					resolve(posts);

				});
				
				

			}).catch(function( err ) {
				// handle error
			});
		});
	}

	
	async presentAlert(msg, subtitle) {
		const alert = await this.alertCtrl.create({
			message: msg,
			subTitle: subtitle,
			buttons: ['OK']
		});

		await alert.present();
	}

	getPost(id): Promise<Post> {
		
		return new Promise((resolve, reject) => {

			const post = this.posts.find(post => post.id == id);
		
			resolve(post);

		});
		
	}

	getSinglePost(id): Promise<any[]> {
		
		return new Promise((resolve, reject) => {


			this.wp.posts().perPage(1).id(id).then( (data) => {
				
				let img = '';

				if (data._embedded['wp:featuredmedia']){
					img = data._embedded['wp:featuredmedia']['0'].source_url;
				}

				let content = data['content'].rendered;

				// this.presentAlert('content', JSON.stringify(content));
				

				// if (data['original_content'].length){
				// 	content = data['original_content'][0];
				// }


				

				let app_link = data['app_link'];

				let is_saved = false;

				if (this.storage.length()){
					this.storage.forEach( (value, key, index) => {
						if (key == data['id']){
							is_saved = true;
						}
					});
				}	

				this.post = {
					id: data['id'],
					title: data['title'].rendered,
					category: data['category_name'][0],
					content: content,
					image: img,
					date: data.date,
					link: data.link,
					app_link: app_link,
					is_saved: is_saved
				};

				resolve(this.post);

			}).catch(function( err ) {
				this.presentAlert('Error', err);
			});
		});
	}

	getSavePost(): Promise<any[]> {
		
		this.posts = [];

		return new Promise((resolve, reject) => {
			if (this.storage.length()){
				this.storage.forEach( (value, key, index) => {
					let data = JSON.parse(value);
					this.posts.push(data);
				});
			}	
			resolve(this.posts);
		});
	}

}
