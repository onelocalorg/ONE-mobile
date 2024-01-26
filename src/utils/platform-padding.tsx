import {Platform} from 'react-native';

export const getBottomPadding = (padding: number) =>
  Platform.OS === 'ios' ? padding + 40 : padding;

export const getTopPadding = (padding: number) =>
  Platform.OS === 'ios' ? padding + 40 : padding;

export const getPlaformSpecificData = (androidData: number, iosData: number) =>
  Platform.OS === 'ios' ? iosData : androidData;
