import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { DetailPage } from '../pages/detail/detail';
import { SavePage } from '../pages/save/save';

import { FcmProvider } from '../providers/fcm/fcm';

import { ToastController } from 'ionic-angular';
import { Subject } from 'rxjs/Subject';
import { tap } from 'rxjs/operators';
import { AdMobPro } from '@ionic-native/admob-pro';
import { AppRate } from '@ionic-native/app-rate';
import { Pro } from '@ionic/pro';
import { ContactPage } from '../pages/contact/contact';
import { BranchIo } from '@ionic-native/branch-io';

// import { SpinnerDialog } from '@ionic-native/spinner-dialog';



@Component({
  templateUrl: 'app.html',
  selector: 'page-app',
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  


  pages: Array<{title: string, component: any, categoryId: number}>;

  constructor(
    private fcm: FcmProvider, 
    private toastCtrl: ToastController, 
    private alertCtrl: AlertController, 
    public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    private admob: AdMobPro,
    private appRate: AppRate,
    private branch: BranchIo
    ) {
    this.initializeApp();

    // used for an example of ngFor and navigation

    this.pages = [
      { title: 'ទំព័រដំបូង', component: HomePage, categoryId: null },
      { title: 'ពត៌មាន Live', component: HomePage, categoryId: 2  },
      { title: 'សុខភាព & ជីវិត', component: HomePage, categoryId: 4  },
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {

      

      this.fcm.getToken();

      try{
        this.fcm.listenToNotifications().subscribe((response) => {
          
          if(response.tap){

            this.nav.setRoot(DetailPage, {
              id: response.id
            });

          }else{
            
            let toast = this.toastCtrl.create({
              message: response.title,
              duration: 3000
            });
            toast.present();

          }
        });
      }catch(err){
        this.presentAlert('Error Token FCM', err);
      }
      
      this.rootPage = HomePage;

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.branch.initSession().then(data => {
        if (data['+clicked_branch_link']) {
          
          let url = data['$canonical_url'];
          if (url){
            url = url.split('p=');
            let id = url[1];
            this.nav.setRoot(DetailPage, {
              id: id
            });
          }
        }
      });
      

      this.showAds();
      
      this.rateAuto();

      
      
    });

    this.platform.resume.subscribe(() => {
      
      this.fcm.getToken();

      try{
        this.fcm.listenToNotifications().subscribe((response) => {
          
          if(response.tap){
          
            this.nav.setRoot(DetailPage, {
              id: response.id
            });
          
          }else{
            
            
            let toast = this.toastCtrl.create({
              message: response.title,
              duration: 3000
            });

            toast.present();

          }
        });
      }catch(err){
        this.presentAlert('Error Token FCM', err);
      }

      this.branch.initSession().then(data => {
        if (data['+clicked_branch_link']) {
          
          
          let url = data['$canonical_url'];
          if (url){
            url = url.split('p=');
            let id = url[1];
            this.nav.setRoot(DetailPage, {
              id: id
            });
          }
          
          
        }
      });
    });


    
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


    setTimeout(() => {
      this.admob.prepareRewardVideoAd({adId: videoAd})
      .then(() => { 
        this.admob.showRewardVideoAd(); 
      });  
    }, 30000);
    
    

    this.admob.createBanner({adId: bannerAd})
    .then(() => {this.admob.showBanner(this.admob.AD_POSITION.BOTTOM_CENTER)});
  }

 

  async presentAlert(msg, subtitle) {
    const alert = await this.alertCtrl.create({
      message: msg,
      subTitle: subtitle,
      buttons: ['OK']
    });

    await alert.present();
  }

  async rateAuto(){
    try {
        this.appRate.preferences = {
          displayAppName: 'Khmer News Live 24',
          usesUntilPrompt: 2,
          simpleMode: true,
          promptAgainForEachNewVersion: false,
          useCustomRateDialog: true,
          storeAppURL: {
            ios: '1440587029',
            android: 'market://details?id=com.khmernewslive24.app'
          },
          customLocale: {
            title: 'ចូលចិត្ត %@ ដែរទេ?',
            message: 'បើអ្នកចូលចិត្ត, ជួយដាក់ពិន្ទុផងបានទេ? សូមអរគុណទុកជាមុន!',
            cancelButtonLabel: 'ទេ',
            laterButtonLabel: 'លើកក្រោយ',
            rateButtonLabel: 'បាន'
          },
          callbacks: {
            onRateDialogShow: function(callback){
              
            },
            onButtonClicked: function(buttonIndex){
              
            }
          }
        };

        this.appRate.promptForRating(false);
    } catch(err){
        
        Pro.monitoring.exception(err);
    }
  }

  async rate(){
    this.appRate.preferences = {
      displayAppName: 'Khmer News Live 24',
      usesUntilPrompt: 2,
      simpleMode: true,
      promptAgainForEachNewVersion: false,
      useCustomRateDialog: true,
      storeAppURL: {
        ios: '1440587029',
        android: 'market://details?id=com.khmernewslive24.app'
      },
      customLocale: {
        title: 'ចូលចិត្ត %@ ដែរទេ?',
        message: 'បើអ្នកចូលចិត្ត, ជួយដាក់ពិន្ទុផងបានទេ? សូមអរគុណទុកជាមុន!',
        cancelButtonLabel: 'ទេ',
        laterButtonLabel: 'លើកក្រោយ',
        rateButtonLabel: 'បាន'
      },
      callbacks: {
        onRateDialogShow: function(callback){
          
        },
        onButtonClicked: function(buttonIndex){
          
        }
      }
    };

    this.appRate.promptForRating(true);
  }
  


  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component, {
      categoryId: page.categoryId
    });
  }

  pushContact(){
    this.nav.setRoot(ContactPage);
  }

  pushSavePage(){
    this.nav.setRoot(SavePage);
  }

}
