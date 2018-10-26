import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { WpProvider } from '../../providers/wp/wp';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Clipboard } from '@ionic-native/clipboard';
import { Toast } from '@ionic-native/toast';
import {HomePage} from '../../pages/home/home';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
})
export class DetailPage {

	public post;

  constructor(
  	private wpProvider: WpProvider, 
  	private socialSharing: SocialSharing, 
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	public alertCtrl: AlertController,
    private clipboard: Clipboard,
    private toast: Toast,
    private storage: Storage) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailPage');
  }

  async shareFacebook(post){
		
  	this.socialSharing.shareViaFacebook(post.title, null, post.app_link).then(() => {

  	});


  }

  async copy(post){
    
    this.clipboard.copy(post.title + ' ឥឡូវនេះ ទាញយកកម្មវីធី Khmer News Live ដោយឥតគិតថ្លៃ! ដើម្បីភាពស្រួល និងទទួលពត៌មានថ្មីៗ ក្នុងដៃជាប់ជានិច្ច!' + post.app_link);
    this.toast.show('Copied...', '1500', 'center').subscribe(
      toast => {
        
      }
    );
  }


  async presentAlert(msg, subtitle) {
		const alert = await this.alertCtrl.create({
			message: msg,
			subTitle: subtitle,
			buttons: ['OK']
		});

		await alert.present();
	}

  goBack(){
    this.navCtrl.pop().then(() => {

    }).catch(() => {
      this.navCtrl.setRoot(HomePage);  
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

  ionViewWillEnter(){
  	let postId = this.navParams.get('id');


  	this.post = this.wpProvider.getPost(postId);

  	if (!this.post){
  		this.wpProvider.getSinglePost(postId).then(post => {
  			this.post = post;
  		});
  	}

  }

}
