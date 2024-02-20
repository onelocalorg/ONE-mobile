import { width } from '@theme/device/device';
import { normalScale, verticalScale } from '@theme/device/normalize';
import { ThemeProps } from '@theme/theme';
import { StyleSheet } from 'react-native';

export const createStyleSheet = (theme: ThemeProps) => {
  return StyleSheet.create({
    scrollView: {
      paddingBottom: verticalScale(200),
    },
    container: {
      // paddingLeft: normalScale(0),
      marginHorizontal:normalScale(16)
    },
    title: {
      fontFamily: theme.fontType.medium,
      fontSize: theme.fontSize.font24,
      color: theme.colors.darkBlack,
      // marginTop: verticalScale(44),
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
      marginHorizontal: normalScale(8),
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
      width:width - 100
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
      height: normalScale(15),
      width: normalScale(15),
      alignSelf:'center',
    },
    text: {
      fontFamily: theme.fontType.regular,
      fontSize: theme.fontSize.font14,
      color: theme.colors.black,
      marginLeft: normalScale(8),
      width:'50%'
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
    localText: {
      textAlign: 'center',
      fontSize: 14,
      fontWeight: '400',
      color: 'white',
      position:'relative',
      bottom:13
    },
    profileContainer: {
      position: 'absolute',
      right: 15,
      bottom: 25
    },
    bellIcon: {
      height: 22,
      width: 22,
      position: 'absolute',
      right: 0,
      zIndex: 11111122,
      borderRadius: 100
    },
    profileView: {
      marginTop: verticalScale(10),
      alignSelf: 'flex-end',
    },
    profile: {
      height: normalScale(55),
      width: normalScale(55),
      borderRadius: normalScale(50),
    },

    HeaderContainerTwo: {
      // borderBottomLeftRadius: theme.borderRadius.radius10,
      // borderBottomRightRadius: theme.borderRadius.radius10,
      backgroundColor: theme.colors.headerColor,
      height: 150,
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
      width:'50%',
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
    },
    subTotalContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 5,
      paddingLeft: 5
    }, 
    subTotalLbl: {
      fontFamily: theme.fontType.extraLight,
      fontSize: 16,
      color: theme.colors.black,
    },
    lineSpace: {
      height: verticalScale(1),
      marginBottom: verticalScale(15),
      backgroundColor: theme.colors.white,
    },

    gesture: {
      flex: 1,
    },
    containerGallery:{
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.colors.modalOverlay,
    },
    keyboardViewTwo: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      // top:0
    },
    addCardBorderContainer: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      borderTopRightRadius: theme.borderRadius.radius16,
      borderTopLeftRadius: theme.borderRadius.radius16,
      paddingVertical: verticalScale(20),
      maxHeight: verticalScale(400),
      height:'auto',
      borderColor: theme.colors.black,
      backgroundColor: theme.colors.white,
      borderTopWidth: theme.borderWidth.borderWidth6,
      borderLeftWidth: theme.borderWidth.borderWidth6,
      borderRightWidth: theme.borderWidth.borderWidth6,
      marginHorizontal: 12,
      // flex: 1,
    },
    cardListContainer:{
      flexDirection: 'row',
      justifyContent:'space-between',
      marginTop: 10,
      marginHorizontal:20
      // height:40
    },
    addCardNewBorderContainer: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      borderTopRightRadius: theme.borderRadius.radius16,
      borderTopLeftRadius: theme.borderRadius.radius16,
      paddingVertical: verticalScale(20),
      height:'auto',
      borderColor: theme.colors.black,
      backgroundColor: theme.colors.white,
      borderTopWidth: theme.borderWidth.borderWidth6,
      borderLeftWidth: theme.borderWidth.borderWidth6,
      borderRightWidth: theme.borderWidth.borderWidth6,
      marginHorizontal: 12,
      maxHeight: verticalScale(700),
    },
    closeCardCont: {
      height: 25,
      width: 25,
      position: 'absolute',
      left: 10,
      top: -11
    },
    addCardTitle: {
      color: theme.colors.black,
      fontSize: theme.fontSize.font18,
      fontFamily: theme.fontType.regular,
      fontWeight: "500",
      textAlign: "center",
    },
    addCardInfo: {
      color: theme.colors.black,
      fontSize: theme.fontSize.font16,
      fontFamily: theme.fontType.regular,
      fontWeight: "400",
      textAlign: 'left',
      marginLeft: 20,
      marginTop: 10,
      // marginBottom: 10
    },
    addCardNameInput: {
      color: theme.colors.black,
      fontSize: theme.fontSize.font14,
      fontFamily: theme.fontType.regular,
      backgroundColor: theme.colors.lightgrayTwo,
      fontWeight: "400",
      textAlign: 'left',
      // margin: 10,
      marginLeft: 20,
      marginRight: 20,
      marginBottom: 10,
      marginTop: 10,
      // paddingTop: 10,
      // paddingBottom:10,
      // paddingLeft: 45,
      padding: 10,
      borderRadius: theme.borderRadius.radius10
    },

    cardList: {
      flexDirection: 'row',
      marginLeft: 10
    },
    cardNum: {
      color: theme.colors.black,
      fontSize: theme.fontSize.font16,
      fontFamily: theme.fontType.regular,
      marginRight: 5,
      marginBottom: 5
    },
    CardexpDate: {
      color: theme.colors.darkGrey,
      fontSize: theme.fontSize.font14,
      fontFamily: theme.fontType.regular,
      marginRight: 5,
    },
    dotclass: {
      color: theme.colors.black,
      fontSize: theme.fontSize.font18,
      fontFamily: theme.fontType.regular,
      marginRight: 5,
      textAlign: 'center',
    },
    purchaseContainer: {
      backgroundColor: '#007112',
      borderRadius: theme.borderRadius.radius14,
      paddingVertical: verticalScale(14),
      shadowColor: theme.colors.black,
      shadowOpacity: theme.opacity.opacity15,
      shadowRadius: theme.borderRadius.radius8,
      shadowOffset: {
        width: 0,
        height: verticalScale(0),
      },
      elevation: 5,
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: normalScale(16),
      marginHorizontal: 45
    },
    titleTwo: {
      fontFamily: theme.fontType.medium,
      fontSize: theme.fontSize.font16,
      color: theme.colors.white,
    },
    buttonArrow: {
      height: normalScale(30),
      width: normalScale(30),
      marginLeft: normalScale(10),
    },

    addCardInput: {
      color: theme.colors.black,
      fontSize: theme.fontSize.font14,
      fontFamily: theme.fontType.regular,
      backgroundColor: theme.colors.lightgrayTwo,
      fontWeight: "400",
      textAlign: 'left',
      // margin: 10,
      marginLeft: 20,
      marginRight: 20,
      marginBottom: 10,
      marginTop: 10,
      // paddingTop: 10,
      // paddingBottom:10,
      paddingLeft: 45,
      padding: 10,
      borderRadius: theme.borderRadius.radius10
    },
    addCardDateInput: {
      color: theme.colors.black,
      fontSize: theme.fontSize.font14,
      fontFamily: theme.fontType.regular,
      backgroundColor: theme.colors.lightgrayTwo,
      fontWeight: "400",
      textAlign: 'left',
      marginLeft: 20,
      marginRight: 20,
      marginBottom: 10,
      marginTop: 10,
      padding: 10,
      borderRadius: theme.borderRadius.radius10
    },
    addCardCVCInput: {
      color: theme.colors.black,
      fontSize: theme.fontSize.font14,
      fontFamily: theme.fontType.regular,
      backgroundColor: theme.colors.lightgrayTwo,
      fontWeight: "400",
      textAlign: 'left',
      marginLeft: 20,
      marginRight: 20,
      marginBottom: 10,
      marginTop: 10,
      padding: 10,
      borderRadius: theme.borderRadius.radius10
    },
    addCardLogo: {
      width: 25,
      height: 15,
      position: 'absolute',
      top: 22,
      left: 30,
      // right:20,
      zIndex: 11111
    },
    cardView: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    greenBtn:{
        height:30,
        width:30,
        alignSelf:'center',
       
    },
    cardContainer:{
      marginVertical:10
    },
    addCardContainer: {
      backgroundColor: theme.colors.lightBlueTwo,
      borderRadius: theme.borderRadius.radius14,
      paddingVertical: verticalScale(14),
      shadowColor: theme.colors.black,
      shadowOpacity: theme.opacity.opacity15,
      shadowRadius: theme.borderRadius.radius8,
      shadowOffset: {
        width: 0,
        height: verticalScale(0),
      },
     
      elevation: 5,
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: normalScale(16),
      marginLeft: 20,
      marginRight: 20,
      marginTop: 8
    },
  });
};
