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
    
    this.clipboard.copy(post.title + '\n\n>>> ដោនឡូត Khmer News Live ក្នុង Play Store ឥឡូវនេះ FREE!!! \n' + post.app_link);
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


  	this.wpProvider.getPost(postId).then((post) => {
        this.post = post;
        let regex = new RegExp(/<([^\s]+).*?src="([^"]*?)".*?>(.+?)<\/\1>/gi);

        // this.presentAlert('content', this.post.content);

        // let matches = this.post.content.match(/<p>.*?<\/p>/g);
        let matches = this.post.content.match(/<p>[\S\s]*?<\/p>/gi);
        // this.presentAlert('result P', JSON.stringify(matches));
        let tmp = document.createElement('div');
        tmp.innerHTML = this.post.content;
        let imgSrc = tmp.getElementsByTagName('img');
        let imgSrcs = [];
        for (let i=0, iLen=imgSrc.length; i<iLen; i++) {
          imgSrcs[i] = imgSrc[i].src;
        }
        

        // let matchesSrc = this.post.content.match(/<img [^>]*src="[^"]*"[^>]*>/gm);
        // .map(x => x.replace(/.*src="([^"]*)".*/, '$1');
        // this.presentAlert('result P', JSON.stringify(imgSrcs));


        // let results = {};
        // for (let i in matches) {
        //     let parts = regex.exec(matches[i]);
        //     results[parts[2]] = parts[3];
        // }

        

        // let str = "<img alt='' src='http://api.com/images/UID' /><br/>Some plain text<br/><a href='http://www.google.com'>http://www.google.com</a>";

        

        
        
        

        
        
    });

    

    


  	if (!this.post){
  		this.wpProvider.getSinglePost(postId).then(post => {
  			this.post = post;
  		});
  	}

    

  }

}
