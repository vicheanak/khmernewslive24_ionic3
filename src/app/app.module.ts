import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, Injectable, Injector } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { ContactPage } from '../pages/contact/contact';
import { DetailPage } from '../pages/detail/detail';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { SocialSharing } from '@ionic-native/social-sharing';

import { Pro } from '@ionic/pro';

import { Firebase } from '@ionic-native/firebase';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { FcmProvider } from '../providers/fcm/fcm';


import { Device } from '@ionic-native/device';
import { WpProvider } from '../providers/wp/wp';


import {TimeAgoPipe} from 'time-ago-pipe';

import {PipesModule} from '../pipes/pipes.module';

import { AdMobPro } from '@ionic-native/admob-pro';
import { AppRate } from '@ionic-native/app-rate';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AppAvailability } from '@ionic-native/app-availability';
import { CallNumber } from '@ionic-native/call-number';

import { BranchIo } from '@ionic-native/branch-io';

const firebase = {
  apiKey: "AIzaSyA77tgx5xc_T6hdBPS-gcaR1NBEW3Oe6lo",
  authDomain: "khmer-news-live-24.firebaseapp.com",
  databaseURL: "https://khmer-news-live-24.firebaseio.com",
  projectId: "khmer-news-live-24",
  storageBucket: "khmer-news-live-24.appspot.com",
  messagingSenderId: "1092261335543"
}

Pro.init('4dc427d8', {
  appVersion: '0.0.1'
})

@Injectable()
export class MyErrorHandler implements ErrorHandler {
  ionicErrorHandler: IonicErrorHandler;

  constructor(injector: Injector) {
    try {
      this.ionicErrorHandler = injector.get(IonicErrorHandler);
    } catch(e) {
      // Unable to get the IonicErrorHandler provider, ensure
      // IonicErrorHandler has been added to the providers list below
    }
  }

  handleError(err: any): void {
    Pro.monitoring.handleNewError(err);
    // Remove this if you want to disable Ionic's auto exception handling
    // in development mode.
    this.ionicErrorHandler && this.ionicErrorHandler.handleError(err);
  }
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    DetailPage,
    ContactPage,
    TimeAgoPipe,
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(firebase), 
    AngularFirestoreModule,
    IonicModule.forRoot(MyApp),
    PipesModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    DetailPage,
    ContactPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SocialSharing,
    IonicErrorHandler,
    Firebase,
    FcmProvider,
    Device,
    AdMobPro,
    AppRate,
    InAppBrowser,
    CallNumber,
    {provide: ErrorHandler, useClass: MyErrorHandler},
    WpProvider,
    AppAvailability,
    BranchIo
  ]
})
export class AppModule {}
