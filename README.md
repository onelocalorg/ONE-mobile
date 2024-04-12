This is the React Native mobile app for the ONE local platform.

# Getting Started

> **Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup?guide=native) instructions till "Creating a new application" step, before proceeding.

## Step 1: Install dependencies

```bash
npm install
```

## Step 2: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
npm start
```

## Step 3: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
npm run android
```

### For iOS

```bash
npm run ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

# Debug Build

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
