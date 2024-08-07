[![Build iOS and upload to Testflight](https://github.com/onelocalorg/ONE-mobile/actions/workflows/dev-build-upload-ios.yaml/badge.svg?branch=dev)](https://github.com/onelocalorg/ONE-mobile/actions/workflows/dev-build-upload-ios.yaml)

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

## Step 2: Start the Metro Server

For development, run:

```bash
npm start
```

If you want to connect to the staging (beta) server, instead run `npm run start:staging`.

## Step 4: Send build to TestFlight

These commands run the entire iOS build and upload it to TestFlight. No other commands
are needed in order to get a build to the testers.

There are two test servers: dev.onelocal.one and beta.onelocal.one and one production
server. You can choose which you want to connect to.

Please note: running a build on Android or iOS makes updates to certain files. I typically
don't push the updates into github because I don't really see the point, but YMMV.

#### For dev:

```bash
npm run testflight
```

or

```bash
npm run testflight:dev
```

You can also generate builds which connect to the other servers with `npm run testflight:beta`,
`npm run testflight:prod`.

## Step 4: Send build to Google AppStore

Because we changed to use a new App ID for Android, the one-button install doesn't work right
now for Android.

1. Manually update the version code in `android/app/build.gradle`

```defaultConfig {
    ...
        versionCode 37
    ...
    }
```

2. Run the build as above, except use `playstore` instead of `testflight`.
3. On the Google Developer Console, create a new release and copy this file into the page:
   `android/app/build/outputs/bundle/release/app-release.abb`.
