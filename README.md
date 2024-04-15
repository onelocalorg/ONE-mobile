This is the React Native mobile app for the ONE local platform.

# Getting Started

> **Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup?guide=native) instructions till "Creating a new application" step, before proceeding.

## Step 1: Install dependencies

```bash
npm install
```

### Setup Mapbox

Follow the instructions to configure React Native Mapbox as described at
https://rnmapbox.github.io/docs/install, both for iOS and Android. You will
need a secret access token that will go in your home directory.

### Get .env file

You will need a `.env` file which contains the keys defined in `.env.template.local`.
This can be obtained by talking to one of the lead devs.

## Step 2: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
npm start
```

## Step 3: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Development

```bash
npm run start:development
```

### For Production

```bash
npm start
```

or

```bash
npm run start:production
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

# Android Debug Build

_Unclear if these instructions are accurate_

1.  react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res

2.  cd android

3.  ./gradlew assembleDebug

=> For Release Build
cd android
./gradlew clean
cd ..
npx react-native run-android

APP Icon Create For IOS And Android
https://easyappicon.com/

4.Find .netrc file in project
Go to Project Directory => find . -name ".netrc"

(1) npm install
(2) go to IOS folder and run pod install
