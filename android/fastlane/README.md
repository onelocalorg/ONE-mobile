fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

## Android

### android patched_google_play_track_version_codes

```sh
[bundle exec] fastlane android patched_google_play_track_version_codes
```



### android fetch_and_increment_build_number

```sh
[bundle exec] fastlane android fetch_and_increment_build_number
```

Fetches the latest version code from the Play Console and increments it by 1

### android build

```sh
[bundle exec] fastlane android build
```

Build

### android test

```sh
[bundle exec] fastlane android test
```

Runs all the tests

### android grab_screens

```sh
[bundle exec] fastlane android grab_screens
```

Build debug, test APK for screenshots and grab screenshots

### android upload_internal_track

```sh
[bundle exec] fastlane android upload_internal_track
```



### android build_dev_upload_play_store

```sh
[bundle exec] fastlane android build_dev_upload_play_store
```

Connect to DEV server, build and upload to Play Store

### android build_beta_upload_play_store

```sh
[bundle exec] fastlane android build_beta_upload_play_store
```

Connect to BETA server, Build and upload to Play Store

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
