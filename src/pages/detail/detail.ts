import { Component } from '@angular/core';
import { NavController, NavParams,Platform, AlertController } from 'ionic-angular';
import { WpProvider } from '../../providers/wp/wp';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Clipboard } from '@ionic-native/clipboard';
import { Toast } from '@ionic-native/toast';
import {HomePage} from '../../pages/home/home';
import { Storage } from '@ionic/storage';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player';
import { AdMobPro } from '@ionic-native/admob-pro';

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
    private storage: Storage,
    private photoViewer: PhotoViewer,
    private youtube: YoutubeVideoPlayer,
    private admob: AdMobPro,
    public platform: Platform) {

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

  openImage(img){
    let options = {
        share: true, // default is false
        copyToReference: true // default is false
    };
    this.photoViewer.show(img, '', options);  
  }


  youtube_parser(url){
      let regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
      let match = url.match(regExp);
      return (match&&match[7].length==11)? match[7] : false;
  }

  facebook_parser(frame) {
    let myRegexp = /2F(\d+)%/g;
    let match = myRegexp.exec(frame);
    return match[1];
  }

  openYoutube(id){
    this.youtube.openVideo(id);
  }

  async showAds(){
    let videoAd;
    let bannerAd;
    if(this.platform.is('android')) 
    {
      videoAd = 'ca-app-pub-3976244179029334/5123051820';
      bannerAd = 'ca-app-pub-3976244179029334/2760612369';
    } 
    else if (this.platform.is('ios')) 
    {
      videoAd = 'ca-app-pub-3976244179029334/4184689885';
      bannerAd = 'ca-app-pub-3976244179029334/5014130799';
    }

    this.admob.prepareRewardVideoAd({adId: videoAd})
    .then(() => { 
      this.admob.showRewardVideoAd(); 
    });  
    
    this.admob.createBanner({adId: bannerAd})
    .then(() => {this.admob.showBanner(this.admob.AD_POSITION.BOTTOM_CENTER)});
  }

  ionViewWillEnter(){
  	let postId = this.navParams.get('id');


  	this.wpProvider.getSinglePost(postId).then((post) => {
        this.post = post;
        this.post.contents = [];
        this.post.imgs = [];
        this.post.iframes = [];
        // let regex = new RegExp(/<([^\s]+).*?src="([^"]*?)".*?>(.+?)<\/\1>/gi);

        // this.presentAlert('content', this.post.content);

        
        // let matches = this.post.content.match(/<p>[\S\s]*?<\/p>/gi);
        // this.presentAlert('result P', JSON.stringify(matches));
        
        let tmpP = document.createElement('div');
        tmpP.innerHTML = this.post.content;
        let pSrc = tmpP.getElementsByTagName('p');
        
        for (let i=0, iLen=pSrc.length; i<iLen; i++) {
          this.post.contents[i] = pSrc[i].innerText;
        }
         


        let tmp = document.createElement('div');
        tmp.innerHTML = this.post.content;
        let imgSrc = tmp.getElementsByTagName('img');
        
        for (let i=0, iLen=imgSrc.length; i<iLen; i++) {
          this.post.imgs[i] = imgSrc[i].src;
        }
         

        let tmpVideo = document.createElement('div');
        tmpVideo.innerHTML = this.post.content;
        let videoSrc = tmpVideo.getElementsByTagName('iframe');
        let videoSrcs = [];
        for (let i=0, iLen=videoSrc.length; i<iLen; i++) {
          let vid = '';
          
          if (videoSrc[i].src.indexOf('youtube') > 0){
            vid = '<iframe width="560" height="315" src="https://www.youtube.com/embed/'+this.youtube_parser(videoSrc[i].src)+'" frameborder="0" allowfullscreen></iframe>';
          }
          if (videoSrc[i].src.indexOf('facebook') > 0){
            // vid = '<iframe src="https://www.facebook.com/plugins/video.php?href='+videoSrc[i].src+'&width=360&show_text=false&height=360" width="360" height="360" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true" allow="encrypted-media" allowFullScreen="true"></iframe>';
            vid = '<iframe src="'+videoSrc[i].src+'" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true" allow="encrypted-media" allowFullScreen="true"></iframe>';
            // vid = '<iframe width="560" height="315" src="http://www.facebook.com/video/embed?video_id='+this.facebook_parser(videoSrc[i].src)+'" frameborder="0" allowfullscreen></iframe>';
            // vid = videoSrc[i].outerHTML;
          }
          
          this.post.iframes[i] = vid;
          
        }

        this.showAds();

        // http://www.facebook.com/video/embed?video_id=10152463995718183

        
        
        
    });



    

    


  	// if (!this.post){
  	// 	this.wpProvider.getSinglePost(postId).then(post => {
  	// 		this.post = post;
  	// 	});
  	// }

    

  }

}
