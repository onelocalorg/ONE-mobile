import {normalScale, verticalScale} from '@theme/device/normalize';
import {ThemeProps} from '@theme/theme';
import {StyleSheet} from 'react-native';

export const createStyleSheet = (theme: ThemeProps) => {
  return StyleSheet.create({
    hamburger: {
      height: verticalScale(20),
      width: normalScale(30),
    },
    notification: {
      height: normalScale(18),
      width: normalScale(18),
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
    dateContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      // marginTop: verticalScale(25),
    },
    calendar: {
      height: normalScale(18),
      width: normalScale(18),
    },
    date: {
      marginHorizontal: normalScale(10),
      fontFamily: theme.fontType.regular,
      fontSize: theme.fontSize.font12,
      color: theme.colors.black,
    },
    arrowDown: {
      width: normalScale(10),
      height: verticalScale(5),
    },
    scrollView: {
      paddingBottom: verticalScale(260),
      // paddingHorizontal: normalScale(22),
    },
    container: {
      paddingHorizontal: normalScale(22),
    },
    view: {
      borderColor: theme.colors.red,
      borderWidth: theme.borderWidth.borderWidth2,
      borderRadius: theme.borderRadius.radius16,
      width: normalScale(102),
      height: verticalScale(66),
      alignItems: 'center',
      justifyContent: 'center',
    },
    icon: {
      height: normalScale(30),
      width: normalScale(30),
    },
    name: {
      fontFamily: theme.fontType.regular,
      fontSize: theme.fontSize.font12,
      color: theme.colors.black,
      marginTop: verticalScale(3),
    },
    modalContainer: {
      borderColor: theme.colors.green,
      height: verticalScale(220),
    },
    optionsView: {
      alignItems: 'center',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: verticalScale(12),
    },
    greenView: {
      borderColor: theme.colors.green,
      marginHorizontal: normalScale(6),
    },
    localText: {
      textAlign: 'center',
      fontSize: 14,
      fontWeight: '400',
      color: 'white',
      position:'relative',
      bottom:13
    },

    dateDisplyContainer:{
      backgroundColor:theme.colors.darkyellow,
      marginVertical:5,
      marginTop:13
    },
    displayDate:{
      textAlign:'center',
      paddingVertical:5,
      fontSize:theme.fontSize.font18,
      fontFamily:theme.fontType.bold,
      color:theme.colors.white
    },

    listContainer: {
      borderRadius: theme.borderRadius.radius16,
      borderWidth: theme.borderWidth.borderWidth1,
      borderColor: theme.colors.red,
      paddingVertical: verticalScale(8),
      paddingHorizontal: normalScale(8),
      backgroundColor: theme.colors.white,
      flexDirection: 'row',
      marginTop: verticalScale(13),
      shadowColor: theme.colors.darkGrey,
      shadowOffset: { width: 1, height: 2 },
      shadowOpacity: 0.9,
      shadowRadius: 4,
      marginHorizontal:13
    },
    dummy: {
      width: normalScale(80),
      height: verticalScale(92),
      marginRight: normalScale(18),
      borderRadius: theme.borderRadius.radius10,
    },
    flex: {
      flex: 1,
      // overflow:'hidden',
    },
    dateText: {
      fontFamily: theme.fontType.light,
      fontSize: theme.fontSize.font12,
      color: theme.colors.black,
      marginBottom: verticalScale(4),
    },
    title: {
      fontFamily: theme.fontType.medium,
      fontSize: theme.fontSize.font16,
      color: theme.colors.black,
      fontWeight:'500'
      // marginBottom: verticalScale(17),
      // maxWidth: normalScale(200),
      // flexShrink:1
    },
    event: {
      height: normalScale(32),
      width: normalScale(32),
      marginLeft: normalScale(12),
    },
    rowClass: {
      flexDirection: 'row',
      paddingTop:5
    },
    pin: {
      height: normalScale(14),
      width: normalScale(14),
      marginRight: normalScale(8),
    },
    location: {
      fontFamily: theme.fontType.light,
      fontSize: theme.fontSize.font12,
      color: theme.colors.black,
      flexShrink:1
    },
    fullAddress: {
      fontFamily: theme.fontType.light,
      fontSize: theme.fontSize.font12,
      color: theme.colors.black,
    },
    addressDot: {
      height: 6,
      width: 6, marginVertical: 5,
      marginHorizontal: 5
    },
    cancleText:{
      position:'absolute',
      right:0,
      top:65,
      fontFamily:theme.fontType.medium,
      fontSize:theme.fontSize.font12,
      color:theme.colors.redTwo
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
      top: 45,
      left: 10,
      height: normalScale(30),
      width: normalScale(30),
      zIndex:11111222222
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
      bottom: 50,
      color: theme.colors.white,
      zIndex:11111222

    },
    searchInput: {
      flexShrink: 1,
      marginLeft: 7,
      marginRight: 5,
      height: 35,
      width: 120,
      color: theme.colors.white,
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
    profileContainer: {
      position: 'absolute',
      right: 15,
      bottom: 30
    },
    bellIcon: {
      height: 22,
      width: 22,
      position: 'absolute',
      right: 0,
      zIndex: 11111122,
      borderRadius:100
    },
    toggleCont: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      // marginTop: verticalScale(25),
    },
    villageLbl: {
      fontFamily:theme.fontType.medium,
      color:theme.colors.black,
      fontSize:theme.fontSize.font14
    },
    switchToggle: {
        
    },
    backgroundToggle:{
      backgroundColor:theme.colors.white,
      paddingVertical:5
    },
    noEventLbl:{
      textAlign:'center',
      color:theme.colors.black,
      fontFamily:theme.fontType.semiBold,
      fontSize:theme.fontSize.font16
    },
    titleContainer : {
      borderRadius: theme.borderRadius.radius20,
      paddingVertical: verticalScale(8),
      paddingHorizontal: normalScale(8),
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.red,
      // marginRight: normalScale(8),
      shadowColor: theme.colors.black,
      shadowOpacity: theme.opacity.opacity15,
      shadowRadius: theme.borderRadius.radius8,
      marginLeft: 20,
      marginRight: 20,
      fontSize: theme.fontSize.font24,
      fontFamily: theme.fontType.medium,
      borderWidth: theme.borderWidth.borderWidth1,
      borderColor: theme.colors.white,
      shadowOffset: {
        width: 0,
        height: verticalScale(0),
      },
      elevation: 5,
    },
    iconEvent: {
      height: 60,
      width: 60,
    },
    label: {
      fontFamily: theme.fontType.regular,
      fontSize: theme.fontSize.font22,
      color: theme.colors.white,
      marginLeft: 10,
    },
    playerDescription: {
      textAlign: 'center',
      // alignSelf: 'center',
      margin: 20,
      fontSize: theme.fontSize.font14,
      fontFamily: theme.fontType.regular,
      color: theme.colors.black
    },
    signUpStyle: {
      marginLeft: 80,
      marginRight: 80,
      marginTop: 10,
      justifyContent: 'center',
      borderRadius: theme.borderRadius.radius10,
      height: 50,
      fontSize: theme.fontSize.font24,
      fontFamily: theme.fontType.regular,
      borderWidth: theme.borderWidth.borderWidth1,
      borderColor: theme.colors.black,
    },
    playerText: {
      textDecorationLine: 'underline',
      textAlign: 'center',
      marginTop: 10,
      color: theme.colors.black,
      fontSize: theme.fontSize.font14,
      fontFamily: theme.fontType.regular,
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
    modalMainContainer:{
      position:'absolute',
      bottom:300,
      backgroundColor:theme.colors.white,
      marginHorizontal:12,
      padding:16,
      borderColor:theme.colors.lightGreen,
      borderWidth:4,
      borderRadius:theme.borderRadius.radius16,
  }

  });
};
