import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { FcmProvider } from '../providers/fcm/fcm';

import { ToastController } from 'ionic-angular';
import { Subject } from 'rxjs/Subject';
import { tap } from 'rxjs/operators';





@Component({
  templateUrl: 'app.html',
  selector: 'page-app',
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{title: string, component: any, categoryId: number}>;

  constructor(private fcm: FcmProvider, private toastCtrl: ToastController, private alertCtrl: AlertController, public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
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

      this.fcm.listenToNotifications().subscribe((response) => {
        if(response.tap){

          //Received while app in background (this should be the callback when a system notification is tapped)
          //This is empty for our app since we just needed the notification to open the app
        }else{

          this.presentAlert('Link', response.data['link']);
          //received while app in foreground (show a toast)
          let toast = this.toastCtrl.create({
            message: response.body,
            duration: 3000
          });
          toast.present();
        }
      });

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      
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
  

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component, {
      categoryId: page.categoryId
    });
  }
}
