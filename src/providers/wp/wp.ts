import WPAPI from 'wpapi';
import { Injectable } from '@angular/core';
import { Pro } from '@ionic/pro';
import {AlertController } from 'ionic-angular';

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

	public posts: Array<{  id: number; title: string; category: string; content: string; image: string; date: string; link: string}> = [];
	private wp: any = new WPAPI({ endpoint: 'https://www.khmernewslive24.com/?_embed&rest_route=/' });
	public post: any;

	constructor(public alertCtrl: AlertController) {
		console.log('Hello WpProvider Provider');
	}

	refresh(category_id): Promise<any[]> {
		this.posts = [];
		return new Promise((resolve, reject) => {
			this.wp.posts().categories(category_id).then( (data) => {

				
				
				for (let i = 0; i < data.length; i++) {
					let img = '';

					if (data[i]._embedded['wp:featuredmedia']){
						img = data[i]._embedded['wp:featuredmedia']['0'].source_url;
					}

					let content = data[i]['the_content'];

					if (data[i]['original_content'].length){
						content = data[i]['original_content'][0];
					}

					this.posts.push({
						id: data[i]['id'],
						title: data[i]['title'].rendered,
						category: data[i]['category_name'][0],
						content: content,
						image: img,
						date: data[i].date,
						link: data[i].link
					});

				}

				resolve(this.posts);

			}).catch(function( err ) {
				// handle error
			});
		});
	}

	getPosts(page, category_id = null): Promise<any[]> {
		return new Promise((resolve, reject) => {
			this.wp.posts().page(page).categories(category_id).then( (data) => {
				
				let posts = [];
				
				for (let i = 0; i < data.length; i++) {
					let img = '';

					if (data[i]._embedded['wp:featuredmedia']){
						img = data[i]._embedded['wp:featuredmedia']['0'].source_url;
					}

					
					let content = data[i]['content']['rendered'];
					if (data[i]['original_content'].length){
						content = data[i]['original_content'][0];
					}

					

					posts.push({
						id: data[i]['id'],
						title: data[i]['title'].rendered,
						category: data[i]['category_name'][0],
						content: content,
						image: img,
						date: data[i].date,
						link: data[i].link
					});

					this.posts.push({
						id: data[i]['id'],
						title: data[i]['title'].rendered,
						category: data[i]['category_name'][0],
						content: content,
						image: img,
						date: data[i].date,
						link: data[i].link
					});

				}
				
				resolve(posts);

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

	getPost(id): Post {
		
		const post = this.posts.find(post => post.id == id);
	
		return post;
		
	}

	getSinglePost(id): Promise<any[]> {
		
		return new Promise((resolve, reject) => {

			this.wp.posts().id(id).then( (data) => {
				

				let img = '';

				if (data._embedded['wp:featuredmedia']){
					img = data._embedded['wp:featuredmedia']['0'].source_url;
				}

				let content = data['the_content'];

				if (data['original_content'].length){
					content = data['original_content'][0];
				}

				this.post = {
					id: data['id'],
					title: data['title'].rendered,
					category: data['category_name'][0],
					content: content,
					image: img,
					date: data.date,
					link: data.link
				};

				

				resolve(this.post);

			}).catch(function( err ) {
				this.presentAlert('Error', err);
			});
		});
	}

	// getPost(id): Post {
	// 	console.log(id);
	// 	return this.posts.find(post => post.id == id);
	// }

}
