#!/bin/bash
ionic cordova platform remove ios
ionic cordova build ios -- --buildFlag="-UseModernBuildSystem=0"
ionic cordova run ios -- --buildFlag="-UseModernBuildSystem=0"
