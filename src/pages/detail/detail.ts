import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { WpProvider } from '../../providers/wp/wp';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Clipboard } from '@ionic-native/clipboard';
import { Toast } from '@ionic-native/toast';

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
    private toast: Toast) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailPage');
  }

  async shareFacebook(post){
		
  	this.socialSharing.shareViaFacebook(post.title, null, post.app_link).then(() => {

  	});


  }

  async copy(post){
    this.clipboard.copy(post.app_link);
    this.toast.show('កូពី', '1500', 'center').subscribe(
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
