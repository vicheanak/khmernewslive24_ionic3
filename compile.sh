#!/bin/bash
ionic cordova build --production --release android --device
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -storepass tU/x@168rY -keystore ~/.ssh/my-release-key.keystore /Users/den/Documents/khmernewslive24_ionic3/platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk alias_name
rm KhmerNewsLive24.apk
zipalign -v 4 /Users/den/Documents/khmernewslive24_ionic3/platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk ./KhmerNewsLive24.apk
adb uninstall com.khmernewslive24.app
adb install -r KhmerNewsLive24.apk
adb shell monkey -p com.khmernewslive24.app -c android.intent.category.LAUNCHER 1
