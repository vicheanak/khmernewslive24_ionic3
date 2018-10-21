import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { DetailPage } from '../pages/detail/detail';

import { FcmProvider } from '../providers/fcm/fcm';

import { ToastController } from 'ionic-angular';
import { Subject } from 'rxjs/Subject';
import { tap } from 'rxjs/operators';
import { AdMobPro } from '@ionic-native/admob-pro';
import { AppRate } from '@ionic-native/app-rate';
import { Pro } from '@ionic/pro';
import { ContactPage } from '../pages/contact/contact';

// import { SpinnerDialog } from '@ionic-native/spinner-dialog';

Pro.init('2bd9848f', {
  appVersion: '0.0.26'
})


@Component({
  templateUrl: 'app.html',
  selector: 'page-app',
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  postId: any = {id: '31934'};

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
    ) {
    this.initializeApp();

    // used for an example of ngFor and navigation

    this.pages = [
      { title: 'ទំព័រដំបូង', component: HomePage, categoryId: null },
      { title: 'ពត៌មាន Live', component: HomePage, categoryId: 2  },
      { title: 'សិល្បះ & កំសាន្ត', component: HomePage, categoryId: 3  },
      { title: 'សុខភាព & ជីវិត', component: HomePage, categoryId: 4  },
      { title: 'យល់ដឹង', component: HomePage, categoryId: 1  },
      { title: 'ប្លែកៗ', component: HomePage, categoryId: 6  },
      { title: 'កីឡា', component: HomePage, categoryId: 16  },
      { title: 'បច្ចេកវិទ្យា', component: HomePage, categoryId: 18  }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {

      this.fcm.getToken();
      this.presentAlert('Notification', 'OPen Home Page');
      this.rootPage = HomePage;

      try{
        this.fcm.listenToNotifications().subscribe((response) => {
          if(response.tap){

            this.presentAlert('Notification', response.data['link']);
            //Received while app in background (this should be the callback when a system notification is tapped)
            //This is empty for our app since we just needed the notification to open the app
            
          }else{
            this.rootPage = DetailPage;
            this.presentAlert('Link', response.data['link']);
            this.presentAlert('Body', response.body);
            //received while app in foreground (show a toast)
            let toast = this.toastCtrl.create({
              message: response.body,
              duration: 3000
            });
            toast.present();

          }
        });
      }catch(err){
        this.presentAlert('Error Token FCM', err);
      }
      

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.showAds();
      
      this.rateAuto();
      
    });
  }

  async showAds(){
    let videoAd;
    let bannerAd;
    if(this.platform.is('android')) 
    {
      videoAd = 'ca-app-pub-3976244189029334/8229934618';
      bannerAd = 'ca-app-pub-3976244189029334/1085941867';
    } 
    else if (this.platform.is('ios')) 
    {
      videoAd = 'ca-app-pub-3976244189029334/3015344375';
      bannerAd = 'ca-app-pub-3976244189029334/4011488000';
    }


    this.admob.prepareRewardVideoAd({adId: videoAd})
    .then(() => { 
      this.admob.showRewardVideoAd(); 
    });
    

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
            ios: '1216856883',
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
        ios: '1216856883',
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

}
