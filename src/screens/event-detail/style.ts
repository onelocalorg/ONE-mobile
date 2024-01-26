import { normalScale, verticalScale } from '@theme/device/normalize';
import { ThemeProps } from '@theme/theme';
import { StyleSheet } from 'react-native';

export const createStyleSheet = (theme: ThemeProps) => {
  return StyleSheet.create({
    scrollView: {
      paddingBottom: verticalScale(200),
    },
    container: {
      paddingHorizontal: normalScale(16),
    },
    title: {
      fontFamily: theme.fontType.medium,
      fontSize: theme.fontSize.font34,
      color: theme.colors.darkBlack,
      marginTop: verticalScale(44),
      marginBottom: verticalScale(6),
    },
    row: {
      flexDirection: 'row',
    },
    circularView: {
      backgroundColor: theme.colors.red,
      borderRadius: theme.borderRadius.radius16,
      paddingVertical: verticalScale(8),
      paddingHorizontal: normalScale(8),
      shadowColor: theme.colors.black,
      shadowOpacity: theme.opacity.opacity15,
      shadowRadius: theme.borderRadius.radius8,
      shadowOffset: {
        width: 0,
        height: verticalScale(0),
      },
      elevation: 5,
      height: normalScale(58),
      width: normalScale(58),
      alignItems: 'center',
      justifyContent: 'center',
    },
    calendarTime: {
      height: normalScale(40),
      width: normalScale(40),
    },
    margin: {
      marginLeft: normalScale(8),
    },
    date: {
      fontFamily: theme.fontType.medium,
      fontSize: theme.fontSize.font16,
      color: theme.colors.darkBlack,
      marginBottom: verticalScale(10),
    },
    time: {
      fontFamily: theme.fontType.light,
      fontSize: theme.fontSize.font12,
      color: theme.colors.black,
    },
    marginTop: {
      marginTop: verticalScale(14),
    },
    yellow: {
      backgroundColor: theme.colors.yellow,
      height: normalScale(58),
      width: normalScale(58),
    },
    pinWhite: {
      height: normalScale(30),
      width: normalScale(30),
    },
    dummy: {
      height: normalScale(52),
      width: normalScale(52),
      borderRadius: normalScale(52),
    },
    eventImage: {
      height: normalScale(144),
    },
    event: {
      marginBottom: verticalScale(8),
      fontFamily: theme.fontType.medium,
      fontSize: theme.fontSize.font18,
      color: theme.colors.darkBlack,
    },
    rowOnly: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: verticalScale(8),
      alignItems: 'center',
    },
    ticket: {
      fontFamily: theme.fontType.regular,
      fontSize: theme.fontSize.font14,
      color: theme.colors.black,
      maxWidth: normalScale(320),
    },
    copy: {
      height: normalScale(20),
      width: normalScale(20),
    },
    desc: {
      fontFamily: theme.fontType.light,
      fontSize: theme.fontSize.font16,
      color: theme.colors.black,
      marginBottom: verticalScale(23),
    },
    modalContainer: {
      paddingHorizontal: normalScale(16),
    },
    amount: {
      marginTop: verticalScale(12),
      fontFamily: theme.fontType.regular,
      fontSize: theme.fontSize.font64,
      color: theme.colors.black,
      alignSelf: 'center',
    },
    radio: {
      height: normalScale(18),
      width: normalScale(18),
    },
    text: {
      fontFamily: theme.fontType.regular,
      fontSize: theme.fontSize.font14,
      color: theme.colors.black,
      marginLeft: normalScale(8),
    },
    line: {
      height: verticalScale(1),
      marginTop: verticalScale(32),
      // marginBottom: verticalScale(70),
      backgroundColor: theme.colors.lightGrey,
    },

    lineTwo: {
      height: verticalScale(1),
      // marginTop: verticalScale(32),
      marginBottom: verticalScale(30),
      backgroundColor: theme.colors.lightGrey,
    },

    HeaderContainerTwo: {
      borderBottomLeftRadius: theme.borderRadius.radius10,
      borderBottomRightRadius: theme.borderRadius.radius10,
      backgroundColor: theme.colors.darkRed,
      height: 160,
      // position: 'relative',
    },
    row2: {
      position: 'absolute',
      top: 52,
      left: 10,
      height: normalScale(35),
      width: normalScale(35),
      zIndex: 11111222222,
      paddingLeft:4,
      paddingTop:4
    },
    arrowLeft: {
      height: normalScale(22),
      width: normalScale(22),
    },
    searchContainer: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      height: 35,
      width: 100,
      borderRadius: 10,
      flexDirection: 'row',
      marginLeft: 8,
      position: 'absolute',
      bottom: 20,
      color: theme.colors.white,
      zIndex: 11111222
    },
    searchInput: {
      flexShrink: 1,
      marginLeft: 7,
      marginRight: 5,
      height: 35,
      width: 120,
      color: theme.colors.white
    },
    searchIcon: {
      height: 15,
      width: 15,
      marginTop: 10,
      marginLeft: 5
    },
    oneContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      position: 'relative',
      top: 50,
    },
    oneContainerImage: {
      height: 60,
      width: 60,
      marginTop: 10,
      marginLeft: 5
    },
    oneContainerText: {
      textAlign: 'center',
      fontSize: 60,
      fontWeight: '400',
      color: theme.colors.white,
      marginLeft: 2,
    },
    quantityContainer: {
      marginHorizontal: 15,
      flexDirection: 'row'
    },
    quantityIcon: {
      height: 20,
      width: 20
    },
    quantityText: {
      fontFamily: theme.fontType.regular,
      marginHorizontal: 15,
      fontSize: 16,
      color: 'black'
    },
    priceTaxcontainer: {
      marginTop: 10,
      marginBottom:10
    },
    totalPrice: {
      fontFamily: theme.fontType.regular,
      fontSize: 16,
      color: 'black',

    },
    soldOutClass: {
      fontFamily: theme.fontType.regular,
      fontSize: 22,
      color: 'red',
      marginVertical:15
    },
    priceTitle: {
      fontFamily: theme.fontType.regular,
      fontSize: 24,
      color: 'black',
      marginBottom:10
    }
  });
};
