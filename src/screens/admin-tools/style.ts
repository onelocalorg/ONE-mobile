import {normalScale, verticalScale} from '@theme/device/normalize';
import {ThemeProps} from '@theme/theme';
import {StyleSheet} from 'react-native';

export const createStyleSheet = (theme: ThemeProps) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      // paadingHorizontal: normalScale(16),
      backgroundColor: theme.colors.white,
    },
    attendee: {
      fontFamily: theme.fontType.regular,
      fontSize: theme.fontSize.font12,
      color: theme.colors.black,
      marginBottom: verticalScale(5),
    },
   
    noAttendee: {
      fontFamily: theme.fontType.regular,
      fontSize: theme.fontSize.font12,
      color: theme.colors.black,
      marginBottom: verticalScale(5),
      alignSelf: 'center',
      marginTop: verticalScale(30),
    },
    pillContainer: {
      alignSelf: 'center',
      marginTop: -verticalScale(22),
    },
    checkIn: {
      justifyContent: 'center',
      width: normalScale(300),
      alignSelf: 'center',
      marginBottom: verticalScale(10),
    },
    innerContainer: {
      paddingHorizontal: normalScale(16),
    },
    scrollView: {
      paddingBottom: verticalScale(100),
    },
    row: {
      flexDirection: 'row',
      marginTop: verticalScale(10),
    },
    center: {
      alignItems: 'center',
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
      backgroundColor: theme.colors.grey,
      borderWidth: theme.borderWidth.borderWidth1,
      borderColor: theme.colors.lightBlack,
      borderRadius: theme.borderRadius.radius8,
      paddingHorizontal: normalScale(4),
      paddingVertical: verticalScale(4),
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
    yellow: {
      backgroundColor: theme.colors.yellow,
      height: normalScale(58),
      width: normalScale(58),
    },
    pinWhite: {
      height: normalScale(30),
      width: normalScale(30),
    },
    textStyle: {
      width: normalScale(278),
    },
    profile: {
      height: normalScale(144),
      width: '100%',
      marginTop: verticalScale(11),
    },
    add: {
      position: 'absolute',
      top: verticalScale(20),
      left: normalScale(10),
    },
    event: {
      fontFamily: theme.fontType.regular,
      fontSize: theme.fontSize.font14,
      color: theme.colors.black,
      marginTop: verticalScale(6),
    },
    marginTop: {
      marginTop: verticalScale(10),
      alignItems: 'center',
      marginBottom: verticalScale(16),
    },
    tickets: {
      fontFamily: theme.fontType.regular,
      fontSize: theme.fontSize.font14,
      color: theme.colors.black,
    },
    addGreen: {
      height: normalScale(28),
      width: normalScale(28),
      marginLeft: normalScale(3),
    },
    ticketTitle:{
      fontFamily: theme.fontType.regular, fontSize: theme.fontSize.font24,color: theme.colors.black,paddingHorizontal: normalScale(16),alignSelf: 'center'
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
    edit: {
      height: normalScale(20),
      width: normalScale(20),
    },
    modalContainer: {
      marginTop: verticalScale(10),
      marginHorizontal: normalScale(16),
    },
    label: {
      marginTop: verticalScale(20),
      marginBottom: verticalScale(4),
      fontFamily: theme.fontType.medium,
      fontSize: theme.fontSize.font16,
      color: theme.colors.black,
    },
    dateView: {
      flexDirection: 'row',
      alignItems: 'center',
      borderColor: theme.colors.lightGrey,
      borderWidth: theme.borderWidth.borderWidth1,
      paddingVertical: verticalScale(10),
      paddingHorizontal: normalScale(8),
      borderRadius: theme.borderRadius.radius10,
    },
    calendar: {
      height: normalScale(18),
      width: normalScale(18),
      marginRight: normalScale(3),
    },
    rowData: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    startLabel: {
      fontFamily: theme.fontType.regular,
      fontSize: theme.fontSize.font12,
      color: theme.colors.black,
      marginLeft: normalScale(3),
    },
    arrowDown: {
      width: normalScale(10),
      height: verticalScale(5),
      marginLeft: normalScale(3),
    },
    bottomButton: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      paddingHorizontal: normalScale(16),
      backgroundColor: theme.colors.white,
      paddingBottom: verticalScale(20),
      paddingTop: verticalScale(5),
    },
    profilePic:{
      height: 50,
      width: 50,
      borderRadius: normalScale(50),
    },
    profileView: {
      // marginTop: verticalScale(10),
      alignSelf: 'flex-end',
      position:'absolute',
      right:5,
      bottom:10
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
      zIndex:11111222222,
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
      zIndex:11111222
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
    profileContainer: {
      position: 'absolute',
      right: 10,
      bottom: 0
    },
    bellIcon: {
      height: 22,
      width: 22,
      position: 'absolute',
      right: 0,
      bottom:50,
      zIndex: 11111122,
      borderRadius:100
    },
    profileImage: {
      height: normalScale(55),
      width: normalScale(55),
      borderRadius: normalScale(50),
    },
  });
};
