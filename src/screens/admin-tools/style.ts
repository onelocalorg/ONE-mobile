import { width } from '@theme/device/device';
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
      paddingBottom:15,
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
      // alignItems: 'center',
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
      marginTop:10
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
      // marginTop: verticalScale(11),
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
    cancleEventBtn:{
      marginHorizontal: 20,
      backgroundColor: theme.colors.white,
      borderRadius: theme.borderRadius.radius14,
      paddingVertical: verticalScale(8),
      shadowColor: theme.colors.black,
      shadowOpacity: theme.opacity.opacity15,
      shadowRadius: theme.borderRadius.radius8,
      borderColor:theme.colors.black,
      borderWidth:theme.borderWidth.borderWidth2,
      color:theme.colors.black,
      shadowOffset: {
       
        width: 0,
        height: verticalScale(0),
      },
      elevation: 5,
      paddingHorizontal: normalScale(10),
      marginTop:12
    },

    cancleEventText:{
      fontSize:14,
      textAlign:'center',
      color:theme.colors.black
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
      bottom: 25
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
    localText: {
      textAlign: 'center',
      fontSize: 14,
      fontWeight: '400',
      color: 'white',
      position:'relative',
      bottom:13
    },


    payInput: {
      backgroundColor: theme.colors.lightgrayTwo,
      borderRadius: 10,
      width: width - 170,
      marginLeft: 10,
      paddingHorizontal: 10,
      height: 35,
      justifyContent: 'center',
    },
    whoCont: {
      fontFamily: theme.fontType.medium,
      color: theme.colors.black,
      fontSize: theme.fontSize.font14,
      marginTop: 8,
    },
    payModalContainer: {
      flexDirection: 'row',
      marginVertical: 8,
    },
    TypeModalContainer: {
      flexDirection: 'row',
      marginTop: 8
    },
    typeDisplayCont: {
      flexDirection: 'row',
    },
    typeLbl: {
      fontFamily: theme.fontType.light,
      color: theme.colors.black,
      fontSize: theme.fontSize.font14,
      borderRadius: 12,
      marginLeft: 6,
      paddingHorizontal: 10,
      paddingVertical: 1,
      borderWidth: 1,
      borderColor: 'lightGrey',
      marginHorizontal: 8,
      fontWeight: '500',
    },
    typeLblTwo: {
      fontFamily: theme.fontType.light,
      color: theme.colors.black,
      fontSize: theme.fontSize.font14,
      paddingVertical: 1,
      paddingHorizontal: 10,
      fontWeight: '500',
    },
    typeCont: {
      fontFamily: theme.fontType.light,
      color: theme.colors.black,
      fontSize: theme.fontSize.font14,
    },
    amountCont: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginRight: 25,
      marginTop: 5,
      borderBottomWidth: 1,
      borderColor: 'lightgrey',
      paddingVertical: 3,
    },
    amountLbl: {
      fontFamily: theme.fontType.light,
      color: theme.colors.black,
      fontSize: theme.fontSize.font14,
    },
    dollarSign: {
      fontFamily: theme.fontType.light,
      color: theme.colors.black,
      fontSize: theme.fontSize.font14,
    },
    percentageSign: {
      fontFamily: theme.fontType.light,
      color: theme.colors.black,
      fontSize: theme.fontSize.font14,
    },
    dollarRupees: {
      fontFamily: theme.fontType.light,
      color: theme.colors.black,
      fontSize: theme.fontSize.font14,
      width: 35,
      height: 20,
      // backgroundColor: theme.colors.lightgrayTwo,
      textAlign: 'left'
    },
    dollarIcon: {
      fontFamily: theme.fontType.light,
      color: theme.colors.black,
      fontSize: theme.fontSize.font14,
      // textAlign: 'center'
    },
    descriptionCont: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 5,
      paddingVertical: 3,
      marginRight: 5,
    },
    descpLbl: {
      fontFamily: theme.fontType.light,
      color: theme.colors.black,
      fontSize: theme.fontSize.font14,
    },
    payoutDescLbl: {
      fontFamily: theme.fontType.light,
      color: theme.colors.black,
      fontSize: theme.fontSize.font14,
      width: width - 230,
      // backgroundColor: theme.colors.lightgrayTwo,
      // height: 26,
      paddingHorizontal: 6
    },
    dateCont: {
      fontFamily: theme.fontType.light,
      color: theme.colors.black,
      fontSize: theme.fontSize.font14,
      textAlign: 'right',
    },
    mediaCont: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginRight: 20,
      borderBottomWidth: 1,
      borderColor: 'lightgrey',
      marginTop: 3,
      paddingVertical: 3,
    },
    mediaLbl: {
      fontFamily: theme.fontType.light,
      color: theme.colors.black,
      fontSize: theme.fontSize.font14,
    },
    addPhotosCont: {
      fontFamily: theme.fontType.light,
      color: theme.colors.black,
      fontSize: theme.fontSize.font14,
      borderWidth: 1,
      borderRadius: 4,
      paddingHorizontal: 3,
      paddingVertical: 2,
      marginRight: -8
    },
    eventContainerTwo: {
      marginTop: 25,
    },

    uniqueViewCont: {
      marginHorizontal: 20,
      width: 100,
      marginBottom: 20
    },
    uniqueViewLbl: {
      alignSelf: 'center',
      fontFamily: theme.fontType.regular,
      fontSize: theme.fontSize.font14,
      color: theme.colors.black,
    },
    uniqueCount: {
      alignSelf: 'center',
      fontFamily: theme.fontType.regular,
      fontSize: theme.fontSize.font14,
      color: theme.colors.black,
    },
    cancelEventCont: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginHorizontal: 14,
      marginVertical: 12,
    },
    cancelEventLbl: {
      fontFamily: theme.fontType.regular,
      fontSize: theme.fontSize.font16,
      color: theme.colors.black,
    },
    eventListCont: {
      marginHorizontal: normalScale(16),
      borderColor: theme.colors.lightGrey,
      borderWidth: theme.borderWidth.borderWidth1,
      paddingVertical: verticalScale(10),
      paddingHorizontal: normalScale(8),
      borderRadius: theme.borderRadius.radius10,
      paddingBottom: 30,
    },
    financialCont: {
      fontFamily: theme.fontType.regular,
      fontSize: theme.fontSize.font14,
      color: theme.colors.black,
      marginBottom: 6,
    },
    revenueCont: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderBottomWidth: theme.borderWidth.borderWidth1,
      borderColor: theme.colors.lightGrey,
      paddingVertical: 4,
      marginHorizontal: 20,
      marginBottom:15
    },
    revenueLbl: {
      fontFamily: theme.fontType.regular,
      fontSize: theme.fontSize.font14,
      color: theme.colors.black,
    },
    revenueRuppes: {
      fontFamily: theme.fontType.regular,
      fontSize: theme.fontSize.font14,
      color: theme.colors.black,
      paddingRight: 4,
    },
    payoutCont: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderBottomWidth: theme.borderWidth.borderWidth1,
      borderColor: theme.colors.lightGrey,
      paddingVertical: 4,
      marginHorizontal: 20,
      marginTop: 20,
    },
    payoutContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 8,
      marginHorizontal: 8,
    },

    sendPayoutLbl: {
      color: theme.colors.white,
      fontFamily: theme.fontType.regular,
      fontSize: theme.fontSize.font12,
      paddingLeft: 4,
    },
    payoutImg: {
      height: 26,
      width: 26,
    },
    payoutsubContainer: {
      flexDirection: 'row',
      backgroundColor: '#8058AE',
      justifyContent: 'center',
      borderRadius: theme.borderRadius.radius8,
      height: 30,
      alignItems: 'center',
      paddingHorizontal: 4,
    },
    payOutDetailsCont: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 5,
    },
    payoutDetailsLbl: {
      color: theme.colors.black,
      fontFamily: theme.fontType.regular,
      fontSize: theme.fontSize.font10,
      width: width - 200,
    },
    userPayoutsStatementCont: {
      marginTop: -8,
    },
    subStatementcont: {
      marginHorizontal: 20,
    },
    expenensLbl: {
      fontFamily: theme.fontType.regular,
      fontSize: theme.fontSize.font14,
      color: theme.colors.black,
    },
    expenensLblTwo: {
      fontFamily: theme.fontType.regular,
      fontSize: theme.fontSize.font11,
      color: theme.colors.black,
      paddingHorizontal: 5,
    },
    userDetailsCont: {
      marginHorizontal: 20,
      // flexDirection: 'row',
      // backgroundColor: 'red'
    },
    detailsSubCont: {
      flexDirection: 'row',
      // backgroundColor: 'green'
    },
    userImage: {
      height: 24,
      width: 24,
      borderRadius: 100,
      marginTop: 8,
    },
    userNameCont: {
      width: width - 200,
    },
    usernameLbl: {
      fontFamily: theme.fontType.regular,
      fontSize: theme.fontSize.font12,
      color: theme.colors.black,
      paddingHorizontal: 5,
      paddingTop: 5,
    },
    payoutForLbl: {
      fontFamily: theme.fontType.regular,
      fontSize: theme.fontSize.font11,
      color: theme.colors.black,
      paddingHorizontal: 15,
    },
    addItemCont: {
      // flexDirection: 'row',
      // justifyContent: 'flex-end',
      marginTop: 6,
      width: 90,
      marginHorizontal: 20,
    },
    subAddItemCont: {
      flexDirection: 'row',
      backgroundColor: '#DCB16C',
      justifyContent: 'center',
      borderRadius: theme.borderRadius.radius6,
      height: 28,
      alignItems: 'center',
      paddingHorizontal: 4,
    },
    plusIcon: {
      color: theme.colors.white,
      fontFamily: theme.fontType.regular,
      fontSize: theme.fontSize.font20,
    },
    addItemLbl: {
      color: theme.colors.white,
      fontFamily: theme.fontType.regular,
      fontSize: theme.fontSize.font12,
      paddingLeft: 4,
    },
    borderBottom: {
      height: 1.5,
      backgroundColor: theme.colors.grey,
      marginHorizontal: 20,
      marginVertical: 8,
    },
    rupeesCont: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginHorizontal: 40,
    },
    rupeesLbl: {
      color: theme.colors.black,
      fontFamily: theme.fontType.regular,
      fontSize: theme.fontSize.font14,
      marginTop: -4,
      fontWeight: '500',
    },
    totalRupeesLbl: {
      color: theme.colors.black,
      fontFamily: theme.fontType.regular,
      fontSize: theme.fontSize.font14,
      paddingTop: 5,
    },
    toggleContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 10,
    },

    villageLblTwo: {
      fontFamily: theme.fontType.medium,
      color: theme.colors.black,
      fontSize: theme.fontSize.font14,
    },
    switchToggle: {},

    breakDownCont: {
      // height: 200
    },
    subBreakdowncont: {
      borderWidth: 1,
      borderRadius: 5,
      marginHorizontal: 16,
      marginVertical: 25,
      paddingLeft: 20,
      paddingBottom: 20,
      borderColor: theme.colors.gray,
    },
    breakdownHeader: {
      paddingTop: 2,
      fontFamily: theme.fontType.medium,
      color: theme.colors.black,
      fontSize: theme.fontSize.font14,
      textAlign: 'center',
    },
    avatarContainer: {
      marginLeft: 20,
      marginRight: 20, 
      // backgroundColor:'red'
    },
    avatarImage: {
      height: 60,
      width: 60,
      borderRadius: 100,
      marginLeft: 10,
      // backgroundColor:'green'
    },
    submitButton: {
    height:38,
    marginTop: 16,
    alignContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    justifyContent: 'center',
    backgroundColor: theme.colors.purple,
    borderRadius: 6
    },
    submitLbl:{
      fontFamily: theme.fontType.medium,
      color: theme.colors.white,
      fontSize: theme.fontSize.font16,
      textAlign: 'center',
    
    },
    multipleImagecont:{
      flex: 1,
      flexDirection:'row',
      // width : '100%',
      flexWrap: 'wrap',
      },
      selectImage:{
        height:90,
        width:'30%',
        borderRadius:18,
        marginRight:10,
        },
  });
};
