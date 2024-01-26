import {Dimensions} from 'react-native';

export const countryCode = '+91';
export const stretch = 'stretch';
export const cover = 'cover';
export const contain = 'contain';
export const screenHeight = Dimensions.get('window').height;
export const screenWidth = Dimensions.get('window').width;
export const numericalRegexExp = /^\d+$/;
export const rupeeSymbol = '₹';
export const light = 'light';
export const numericRegexWithDecimalEx = /^\d+(\.\d{1,2})?$/;
export const emailRegexEx =
  /^([\w!#$%&'*+/=?^`{|}~-]+(?:\.[\w!#$%&'*+/=?^`{|}~-]+)*)@((?:[\dA-Za-z](?:[\dA-Za-z-]*[\dA-Za-z])?\.)+[\dA-Za-z](?:[\dA-Za-z-]*[\dA-Za-z])?)$/;
export const bottomTabs = {
  home: 'home',
  calendar: 'calendar',
  chat: 'chat',
  gratitude: 'gratitude',
  addButton: 'addButton',
};
export const stripeClientSecretKey =
  'sk_test_51NSDgZSDObEr711q4NPMHjc8w4nPGZBU1nJ2ONn7Muu5VxUNm8dIju640bzJ10YGpXfDuICg75heSjOS6hZd3GXC00sfTqxi4L';
export const animationDuration = {
  D2000: 2000,
};
export const stripeSuccessUrl = 'https://example.com/success';
export const appStoreLink = 'https://apps.apple.com/in/app';
export const appVersion = {
  android: '1.0.0',
  ios: '1.0.0',
};
