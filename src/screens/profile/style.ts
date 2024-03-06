import { height, width } from '@theme/device/device';
import { normalScale, verticalScale } from '@theme/device/normalize';
import { ThemeProps } from '@theme/theme';
import { getTopPadding } from '@utils/platform-padding';
import { StyleSheet } from 'react-native';


export const createStyleSheet = (theme: ThemeProps) => {
  return StyleSheet.create({
    logout: {
      fontFamily: theme.fontType.medium,
      fontSize: theme.fontSize.font14,
      color: theme.colors.white,
    },
    container: {
      flex: 1,
    },
    profileContainer: {
      borderColor: theme.colors.white,
      borderRadius: normalScale(56),
      borderWidth: theme.borderWidth.borderWidth1,
      marginTop: verticalScale(100),
      alignSelf: 'flex-start',
      marginLeft: normalScale(7),
      position: 'absolute',
    },
    profile: {
      height: normalScale(112),
      width: normalScale(112),
      borderRadius: normalScale(112),
    },
    center: {
      alignSelf: 'center',
      marginTop: verticalScale(2),
      marginLeft: normalScale(50),
      alignItems: 'center',
    },
    name: {
      fontFamily: theme.fontType.medium,
      fontSize: theme.fontSize.font24,
      color: theme.colors.darkBlack,
      marginBottom: verticalScale(4),
      maxWidth: normalScale(150),
    },
    circularView: {
      paddingVertical: verticalScale(2),
      paddingHorizontal: normalScale(5),
      borderColor: theme.colors.lightWhite,
      borderWidth: theme.borderWidth.borderWidth1,
      borderRadius: theme.borderRadius.radius12,
      marginTop:5
    },
    userNameClass:{

      flexDirection:'row',
      marginLeft:50,
    },
    firstName:{
      fontFamily: theme.fontType.medium,
      fontSize: theme.fontSize.font18,
      color: theme.colors.darkBlack,
      marginBottom: verticalScale(4),
      width: normalScale(100),
      borderColor:theme.colors.lightWhite,
      borderRadius:theme.borderRadius.radius12,
      borderWidth: theme.borderWidth.borderWidth1,
      padding:5,
      marginTop:5,
      marginHorizontal:5
    },
lastName:{
  fontFamily: theme.fontType.medium,
  fontSize: theme.fontSize.font18,
  color: theme.colors.darkBlack,
  marginBottom: verticalScale(4),
  width: normalScale(100),
  borderColor:theme.colors.lightWhite,
  borderRadius:theme.borderRadius.radius12,
  borderWidth: theme.borderWidth.borderWidth1,
  padding:5,
  marginTop:5,
  marginHorizontal:5
},
    des: {
      fontFamily: theme.fontType.regular,
      fontSize: theme.fontSize.font14,
      color: theme.colors.black,
      width:normalScale(150)
    },
    payView: {
      backgroundColor: theme.colors.purpleDark,
      alignSelf: 'flex-end',
      flexDirection:'row',
      borderRadius: theme.borderRadius.radius6,
      paddingVertical: verticalScale(2),
      paddingHorizontal: normalScale(8),
      marginLeft: normalScale(6),
      marginVertical:10
    },
    payoutIcon:{
      height:30,
      width:30
    },
    pay: {
      fontFamily: theme.fontType.medium,
      fontSize: theme.fontSize.font12,
      color: theme.colors.white,
      alignSelf:'center',
      paddingLeft:10
    },
    aboutView: {
      // marginTop: verticalScale(25),
      marginHorizontal: normalScale(6),
    },
    input: {
      backgroundColor: 'transparent',
      borderColor: theme.colors.lightWhite,
      borderWidth: theme.borderWidth.borderWidth1,
    },
    inputText: {
      fontFamily: theme.fontType.regular,
      fontSize: theme.fontSize.font14,
      color: theme.colors.black,
      marginHorizontal:15
    },
    about: {
      fontFamily: theme.fontType.regular,
      fontSize: theme.fontSize.font14,
      color: theme.colors.black,
    },
    line: {
      height: verticalScale(4),
      backgroundColor: theme.colors.greyLine,
      marginVertical: verticalScale(10),
    },
    marginBottom: {
      marginBottom: verticalScale(10),
    },
    innerConatiner: {
      marginHorizontal: normalScale(12),
    },
    rowOnly: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    membership: {
      marginVertical: verticalScale(8),
      fontFamily: theme.fontType.medium,
      fontSize: theme.fontSize.font18,
      color: theme.colors.darkBlack,
      marginRight: 8
    },
    skillAddImage: {
      position: 'absolute',
      right: 6,
      height: 22,
      width: 22,
      marginVertical: verticalScale(16),
    },
    skillCont: {
      position: 'relative'
    },
    flexWrap: {
      flexWrap: 'wrap',
    },
    save: {
      height: normalScale(25),
      width: normalScale(25),
    },
    buttonView: {
      flexDirection: 'row',
      marginBottom: 8,
      flexWrap: 'wrap',
      // flex:1
    },
    buttonViewTwo: {
      paddingVertical: verticalScale(6),
    },
    aboutContainer: {
      borderColor: theme.colors.lightWhite,
      borderRadius: normalScale(12),
      borderWidth: theme.borderWidth.borderWidth1,
      paddingVertical: verticalScale(6),
      paddingHorizontal: normalScale(6),
    },
    row: {
      flexDirection: 'row',
      marginTop: verticalScale(12),
    },
 
    modalContainer: {
      marginTop: verticalScale(20),

    },
    subPlayerContainer: {
      marginLeft: verticalScale(7),
      marginRight: verticalScale(7),
      backgroundColor: 'white',
      opacity: 0.8,
      borderColor: theme.colors.lightGreen,
      borderWidth: theme.borderWidth.borderWidth1,
    },
    subEventContainer: {
      marginLeft: verticalScale(7),
      marginRight: verticalScale(7),
      backgroundColor: 'white',
      opacity: 0.8,
      borderColor: theme.colors.red,
      borderWidth: theme.borderWidth.borderWidth1,
    },
    subOrgContainer: {
      marginLeft: verticalScale(7),
      marginRight: verticalScale(7),
      backgroundColor: 'white',
      opacity: 0.8,
      borderColor: theme.colors.yellow,
      borderWidth: theme.borderWidth.borderWidth1,
    },
    subProviderContainer: {
      marginLeft: verticalScale(7),
      marginRight: verticalScale(7),
      backgroundColor: 'white',
      opacity: 0.8,
      borderColor: theme.colors.lightblue,
      borderWidth: theme.borderWidth.borderWidth1,
    },
    addCardBorderContainer: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      borderTopRightRadius: theme.borderRadius.radius16,
      borderTopLeftRadius: theme.borderRadius.radius16,
      paddingVertical: verticalScale(20),
      borderColor: theme.colors.black,
      backgroundColor: theme.colors.white,
      borderTopWidth: theme.borderWidth.borderWidth6,
      borderLeftWidth: theme.borderWidth.borderWidth6,
      borderRightWidth: theme.borderWidth.borderWidth6,
      marginHorizontal: 12,
      // flex: 1,
    },
    localText: {
      textAlign: 'center',
      fontSize: 14,
      fontWeight: '400',
      color: 'white',
      position:'relative',
      bottom:13
    },
    pillStyle: {
      alignSelf: 'center',
    },
    selectContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginHorizontal: normalScale(24),
      marginTop: verticalScale(20),
    },
    selectView: {
      paddingHorizontal: normalScale(8),
      paddingVertical: verticalScale(8),
      alignItems: 'center',
      justifyContent: 'center',
    },
    selectedSelectView: {
      borderColor: theme.colors.lightPurple,
      borderRadius: normalScale(10),
      borderWidth: theme.borderWidth.borderWidth6,
    },
    amount: {
      fontFamily: theme.fontType.regular,
      fontSize: theme.fontSize.font64,
      color: theme.colors.black,
    },
    bill: {
      fontFamily: theme.fontType.regular,
      fontSize: theme.fontSize.font14,
      color: theme.colors.black,
    },
    button: {
      marginHorizontal: normalScale(44),
      marginTop: verticalScale(200),

    },
    noMoreTitle: {
      fontFamily: theme.fontType.bold,
      fontSize: theme.fontSize.font14,
      color: theme.colors.black,
      // marginTop:verticalScale(6),
      marginBottom: verticalScale(25),
      alignSelf: 'center',
    },
    loader: {
      height: verticalScale(450),
      backgroundColor: 'transparent',
    },
    scrollView: {
      paddingBottom: verticalScale(200),
      paddingHorizontal: normalScale(22),
    },
    scrollViewEvent: {
      paddingBottom: verticalScale(50),
      paddingHorizontal: normalScale(22),
    },
    icon: {
      height: 60,
      width: 60,
      // backgroundColor: theme.colors.white,
    },
    icon1: {
      height: normalScale(30),
      width: normalScale(30),
      marginRight: normalScale(8),
    },

    playerStyle: {
      marginLeft: 20,
      marginRight: 20,
      flexDirection: 'row',
      fontSize: theme.fontSize.font24,
      fontFamily: theme.fontType.regular,
      borderWidth: theme.borderWidth.borderWidth1,
      borderColor: theme.colors.white,
    },
    playerbody: {
      borderColor: theme.colors.black
    },
    playerDescription: {
      textAlign: 'center',
      // alignSelf: 'center',
      margin: 20,
      fontSize: theme.fontSize.font14,
      fontFamily: theme.fontType.regular,
      color: theme.colors.black
    },
    postImageStyle: {
      height: 360,
      width: 370
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
    cancleSubStyle: {
      textAlign: 'center',
      marginTop: 20,
      marginBottom: 20,
      color: theme.colors.black,
      fontFamily: theme.fontType.regular,
      fontSize: theme.fontSize.font16,
    },
    addCard: {
      color: theme.colors.black,
      fontFamily: theme.fontType.regular,
      fontSize: theme.fontSize.font14,
    },
    addViewcard: {
      flexDirection: 'row',
      justifyContent: 'center',
      borderColor: theme.colors.black,
      borderWidth: theme.borderWidth.borderWidth1,
      borderRadius: theme.borderRadius.radius10,
      width: 120,
      padding: 5,
      marginLeft: 20,
      marginTop: 15
    },
    addImage: {
      height: 20,
      width: 20
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
      marginBottom: 10
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
    borderColor: {
      // borderColor: theme.colors.black,
      borderWidth: theme.borderWidth.borderWidth1
    },
    cardView: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    subcriptionView: {
      display: 'flex',

    },
    imageComp: {
      height: normalScale(30),
      width: normalScale(30),
      marginRight: normalScale(8),
    },
    textSub: {
      fontFamily: theme.fontType.regular,
      fontSize: theme.fontSize.font12,
      color: theme.colors.white,
    },
    containers: {
      paddingVertical: verticalScale(6),
      // flex: 1,
      // flexDirection: 'row',
      // flexWrap: 'wrap',
      // alignItems: 'flex-start',
      // width:'auto'
    },
    packageDetailModal: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      borderTopRightRadius: theme.borderRadius.radius16,
      borderTopLeftRadius: theme.borderRadius.radius16,
      paddingVertical: verticalScale(20),
      borderColor: theme.colors.lightGreen,
      backgroundColor: theme.colors.white,
      borderTopWidth: 4,
      borderLeftWidth: 4,
      borderRightWidth: 4,
      marginHorizontal: 7,
      maxHeight: verticalScale(600),
    },
    packageModalMembership: {
      position: 'absolute',
      // top: 210,
      bottom: 0,
      left: 0,
      right: 0,
      height:'auto',
      // backgroundColor: theme.colors.modalOverlay,
      borderTopRightRadius: theme.borderRadius.radius16,
      borderTopLeftRadius: theme.borderRadius.radius16,
      paddingVertical: verticalScale(20),
      maxHeight: verticalScale(600),
      borderColor: theme.colors.lightPurple,
      backgroundColor: 'rgba(255, 255, 255, 0.88)',
      borderTopWidth: 3,
      borderLeftWidth: 3,
      borderRightWidth: 3,
      // flex: 1,
      marginHorizontal: 10
    },
    imageActionSheet: {
      position: 'absolute',
      // top: 310,
      bottom: 0,
      left: 0,
      right: 0,
      height: 'auto',
      // backgroundColor: theme.colors.modalOverlay,
      borderTopRightRadius: theme.borderRadius.radius16,
      borderTopLeftRadius: theme.borderRadius.radius16,
      paddingVertical: verticalScale(20),
      maxHeight: verticalScale(600),
      borderColor: theme.colors.lightPurple,
      backgroundColor: 'rgba(255, 255, 255, 0.88)',
      borderTopWidth: 3,
      borderLeftWidth: 3,
      borderRightWidth: 3,
      flex: 1,
      marginHorizontal: 10
    },
    gesture: {
      flex: 1,
    },

    label: {
      fontFamily: theme.fontType.regular,
      fontSize: theme.fontSize.font22,
      color: theme.colors.white,
      marginLeft: 10,
      // justifyContent: 'center',
      // alignItems: 'center',
    },

    label1: {
      fontFamily: theme.fontType.regular,
      fontSize: theme.fontSize.font12,
      color: theme.colors.white,
      // justifyContent: 'center',
      // alignItems: 'center',
    },

    container1: {
      borderRadius: theme.borderRadius.radius20,
      paddingVertical: verticalScale(8),
      paddingHorizontal: normalScale(8),
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.lightGreen,
      // marginRight: normalScale(8),
      shadowColor: theme.colors.black,
      shadowOpacity: theme.opacity.opacity15,
      shadowRadius: theme.borderRadius.radius8,
      marginLeft: 20,
      marginRight: 20,
      fontSize: theme.fontSize.font24,
      fontFamily: theme.fontType.regular,
      borderWidth: theme.borderWidth.borderWidth1,
      borderColor: theme.colors.white,
      shadowOffset: {
        width: 0,
        height: verticalScale(0),
      },
      elevation: 5,
    },

    container2: {
      borderRadius: theme.borderRadius.radius20,
      paddingVertical: verticalScale(8),
      paddingHorizontal: normalScale(8),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginRight: normalScale(8),
      shadowColor: theme.colors.black,
      shadowOpacity: theme.opacity.opacity15,
      shadowRadius: theme.borderRadius.radius8,
      backgroundColor: theme.colors.yellow,
      borderWidth: theme.borderWidth.borderWidth1,
      borderColor: theme.colors.black,
      shadowOffset: {
        width: 0,
        height: verticalScale(0),
      },
      elevation: 5,
    },

    container3: {
      borderRadius: theme.borderRadius.radius20,
      paddingVertical: verticalScale(8),
      paddingHorizontal: normalScale(8),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginRight: normalScale(8),
      shadowColor: theme.colors.black,
      shadowOpacity: theme.opacity.opacity15,
      shadowRadius: theme.borderRadius.radius8,
      // backgroundColor: theme.colors.yellow,
      // borderWidth:theme.borderWidth.borderWidth1,
      // borderColor:theme.colors.black,
      shadowOffset: {
        width: 0,
        height: verticalScale(0),
      },
      elevation: 5,
    },
    cardList: {
      flexDirection: 'row',
      marginLeft: 20
    },
    cardNum: {
      color: theme.colors.black,
      fontSize: theme.fontSize.font18,
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
    paymentInfo: {
      color: theme.colors.black,
      fontSize: theme.fontSize.font22,
      fontFamily: theme.fontType.regular,
      fontWeight: '600',
      marginLeft: 20,
      marginBottom: 10
    },
    dotclass: {
      color: theme.colors.black,
      fontSize: theme.fontSize.font18,
      fontFamily: theme.fontType.regular,
      marginRight: 5,
      textAlign: 'center',
    },
    memberTitle: {
      fontFamily: theme.fontType.regular,
      fontSize: theme.fontSize.font24,
      color: theme.colors.black,
      paddingHorizontal: normalScale(16),
      alignSelf: 'center',
    },
    purchesButton: {
      marginTop: 50
    },
    purchaseContainer: {
      backgroundColor: theme.colors.purple,
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
    title: {
      fontFamily: theme.fontType.medium,
      fontSize: theme.fontSize.font16,
      color: theme.colors.white,
    },
    buttonArrow: {
      height: normalScale(30),
      width: normalScale(30),
      marginLeft: normalScale(10),
    },
    HeaderContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 60,
     height:60
    },
    downIcon: {
      height: 24,
      width: 24,
    },
    saveContainer: {
      fontSize: 18,
      fontFamily: theme.fontType.regular,
      fontWeight: '500',
      color: 'black',
      paddingTop:16,
      height:60,
      width: 60,
      
    },
    MainContainer: {
      fontSize: 22,
      fontFamily: theme.fontType.regular,
      fontWeight: '600',
      color: 'black',
      paddingTop:14
    },
    listContainer: {
      marginTop: 25,
      marginBottom:20
    },
    questionsLbl: {
      fontSize: 16,
      fontFamily: theme.fontType.regular,
      fontWeight: '600',
      marginLeft: 16,
      marginRight: 16,
      marginBottom: 14,
      color: 'black',
    },
    answerLbl: {
      fontSize: 16,
      fontFamily: theme.fontType.regular,
      fontWeight: '400',
      marginLeft: 8,
      marginRight: 12,
      height: 110,
      // marginBottom: 10,
      color: 'black',
      flex: 1
    },
    dropDownView:{
      paddingLeft:16,
      paddingTop:18,
      height: 60,
      width: 60,
      
    },

    memberShipCheckputContainer:{
      borderRadius: theme.borderRadius.radius20,
        paddingVertical: verticalScale(6),
        paddingHorizontal: normalScale(6),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginRight: normalScale(8),
        shadowColor: theme.colors.black,
        shadowOpacity: theme.opacity.opacity15,
        shadowRadius: theme.borderRadius.radius8,
        shadowOffset: {
          width: 0,
          height: verticalScale(0),
        },
        elevation: 5,
        alignSelf: 'center',
    },
    inputCont: {
      marginRight: 16,
      marginLeft: 16,
      textAlign: 'left',
      color: 'black'
    },
    ProfileUpdateCont: {
      alignItems: 'center',
      color: '#91BAD4',
      fontSize: 16,
      fontFamily: theme.fontType.regular,
      fontWeight: '500',
      borderWidth: 1,
      paddingVertical: verticalScale(8),
      paddingHorizontal: normalScale(8),
      height: 40,
      borderColor: '#91BAD4',
      marginHorizontal: 60,
      marginTop: 12,
      marginBottom: 24
    },

    answerDisplayCont: {
      fontSize: 14,
      fontFamily: theme.fontType.regular,
      fontWeight: '400',
      marginLeft: 8,
      marginRight: 12,
      marginBottom: 12,
      flex: 1,
      color: 'black'
    },
    questionsDisplayLbl: {
      fontSize: 14,
      fontFamily: theme.fontType.regular,
      fontWeight: '600',
      marginLeft: 8,
      marginRight: 12,
      marginBottom: 14,
      color: 'black'
    },
    closeCardCont: {
      height: 25,
      width: 25,
      position: 'absolute',
      left: 10,
      top: -11
    },

    galleryText:{
      textAlign: 'center',
      fontSize: 18,
      fontFamily: 'NotoSerif-Medium',
      backgroundColor: '#A493B7',
      color: 'white',
      padding: 10,
      margin: 10,
    },
    cameraText:{
      textAlign: 'center',
      fontSize: 18,
      fontFamily: 'NotoSerif-Medium',
      backgroundColor: '#A493B7',
      color: 'white',
      padding: 10,
      margin: 10,
    },
  
  
    imageContainer: {
      height: 120,
      overflow: 'hidden',
      borderBottomLeftRadius: theme.borderRadius.radius10,
      borderBottomRightRadius: theme.borderRadius.radius10,
      alignItems: 'center',
      paddingHorizontal: normalScale(14),
      backgroundColor: theme.colors.headerColor
    },
    // row: {
    //   flexDirection: 'row',
    //   marginTop: verticalScale(getTopPadding(8)),
    //   width: '100%',
    //   justifyContent: 'space-between',
    // },
    image: {
      height: verticalScale(33),
      width: normalScale(242),
      alignSelf: 'center',
    },
    cityClass: {
      // textAlign: 'center',
      paddingVertical: 22,
      paddingHorizontal: 198,
      fontWeight: '400',
      fontSize: 16,
      fontFamily: theme.fontType.regular,
      color: theme.colors.white
    },
  
    // input: {
    //   flex: 1,
    //   height: 40,
    //   justifyContent: "center"
    // },


  
    arrowClass: {
      height: 25,
      width: 25,
      position: 'absolute',
      top: 35,
      left: 16,
    },
    // profile: {
    //   // height: 55,
    //   // width: 55,
    //   // borderRadius: theme.borderRadius.radius35
    // },
    // profileContainer: {
    //   position: 'absolute',
    //   right: 15,
    //   bottom: 15
    // },
    bellIcon: {
      height: 22,
      width: 22,
      position: 'absolute',
      right: 0,
      zIndex: 11111122,
      borderRadius: 100
    },




    HeaderContainerTwo: {
      // borderBottomLeftRadius: theme.borderRadius.radius10,
      // borderBottomRightRadius: theme.borderRadius.radius10,
      backgroundColor: theme.colors.headerColor,
      height: 150,
      // position: 'relative',
    },
    HeaderContainerTwoBg: {
      height: 150,
    },
    row2: {
      position: 'absolute',
      top: 60,
      left: 10,
      height: normalScale(37),
      width: normalScale(37),
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
      bottom: 90,
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
      fontFamily: theme.fontType.regular,
      fontWeight: '400',
      color: theme.colors.white,
      marginLeft: 2,
    },

    keyboardView: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      top:0
    },

    keyboardViewTwo: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      // top:0
    },
    containerGallery:{
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.colors.modalOverlay,
    },
    containerGalleryModal:{
      position: 'absolute',
      top: 470,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.colors.modalOverlay,
    },
    deleteAccount:{
      fontSize: 16,
      fontFamily: theme.fontType.regular,
      color:theme.colors.white,
      backgroundColor:theme.colors.darkRed,
      textAlign:'center',
      padding:10,
      paddingTop:16,
      fontWeight: '600',
      marginHorizontal:10,
      marginBottom:8,
      borderRadius:12,
      height:55
    },
    gratiesImage: {
      height: 25,
      width: 25,
      marginVertical:12
    },
    gratiesNumber: {
      fontSize: 18,
      fontFamily: theme.fontType.bold,
      color: theme.colors.black,
      marginVertical:10,
      alignSelf:'center',
      marginLeft: 6
    },
    gratiesCont: {
      flexDirection: 'row',
      paddingLeft: 30,
      paddingRight:15,
      justifyContent:'space-between',
    },

    payoutAndGratisCont:{
      flexDirection: 'row',
    }

  });
};
