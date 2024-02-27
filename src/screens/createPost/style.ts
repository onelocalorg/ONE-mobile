import { height, width } from '@theme/device/device';
import { normalScale, verticalScale } from '@theme/device/normalize';
import { borderRadius } from '@theme/fonts';
import { ThemeProps } from '@theme/theme';
import { StyleSheet } from 'react-native';

export const createStyleSheet = (theme: ThemeProps) => {
  return StyleSheet.create({
    container: {
      justifyContent: 'center',
      backgroundColor: theme.colors.white,
      alignItems: 'center',
      flex: 1,
    },
    text: {
      fontSize: theme.fontSize.font14,
      fontFamily: theme.fontType.regular,
      color: theme.colors.black,
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
      height: normalScale(30),
      width: normalScale(30),
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
      bottom: 40,
      color: theme.colors.white,
      zIndex: 11111222

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
      fontFamily: theme.fontType.regular,
      marginLeft: 2,
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
    localText: {
      textAlign: 'center',
      fontSize: 14,
      fontWeight: '400',
      color: 'white',
      position:'relative',
      bottom:13
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
    pillStyle: {
      alignSelf: 'center',
    },
    container2: {
      borderRadius: theme.borderRadius.radius20,
      paddingVertical: verticalScale(6),
      paddingHorizontal: normalScale(6),
      paddingLeft: 11,
      flexDirection: 'row',
      // justifyContent: 'space-between',
      alignItems: 'center',
      marginRight: normalScale(2),
      marginLeft: normalScale(2),
      shadowColor: theme.colors.black,
      shadowOpacity: theme.opacity.opacity15,
      shadowRadius: theme.borderRadius.radius8,
      backgroundColor: theme.colors.white,
      borderWidth: theme.borderWidth.borderWidth1,
      borderColor: theme.colors.black,
      width: 110,
      shadowOffset: {
        width: 0,
        height: verticalScale(0),
      },
      elevation: 5,
      // position:'absolute',
      top: -20
    },
    icon1: {
      height: normalScale(30),
      width: normalScale(30),
      marginRight: normalScale(8),
    },
    label1: {
      fontFamily: theme.fontType.regular,
      fontSize: theme.fontSize.font12,
      color: '#197127'
      // justifyContent: 'center',
      // alignItems: 'center',
    },
    label1Service: {
      fontFamily: theme.fontType.regular,
      fontSize: theme.fontSize.font12,
      color: '#0081D2'
    },
    label1Event: {
      fontFamily: theme.fontType.regular,
      fontSize: theme.fontSize.font12,
      color: '#B10E00'
    },
    filterTags: {
      flexDirection: 'row',
      justifyContent: 'center'
    },
    avatarImage: {
      height: 60,
      width: 60,
      borderRadius: 100,
      marginLeft: 10,
      // backgroundColor:'green'
    },
    avatarContainer: {
      marginLeft: 20,
      marginRight: 20, 
      // backgroundColor:'red'
    },
    skillAddImage: {
      position: 'absolute',
      bottom:-10,
      right: 16,
      height: 22,
      width: 22,
      marginVertical: verticalScale(16),
    },
    avatar: {
      height: 40,
      width: 40,
      borderRadius: 100,
      marginLeft: 10,
    },
    marginBottom: {
      marginBottom: verticalScale(10),
    },
    flexWrap: {
      flexWrap: 'wrap',
    },
    postInput: {
      backgroundColor: 'lightgray',
      borderRadius: 22,
      width: width - 90,
      marginLeft: 10,
      paddingHorizontal: 10,
      justifyContent:'center',
      fontFamily: theme.fontType.regular,

    },
    postContainer: {
      marginVertical: 10,
      flexDirection: 'row',
    },
    postFilter: {
      flexDirection: 'row',
      justifyContent: 'center'
    },
    container3: {
      borderRadius: theme.borderRadius.radius20,
      paddingVertical: verticalScale(6),
      paddingHorizontal: normalScale(6),
      flexDirection: 'row',
      // justifyContent: 'space-between',
      alignItems: 'center',
      marginRight: normalScale(2),
      marginLeft: normalScale(2),
      width: 110,
      elevation: 5,
    },
    time: {
      fontFamily: theme.fontType.light,
      fontSize: theme.fontSize.font12,
      color: theme.colors.black,
      
    },
    label2: {
      fontFamily: theme.fontType.regular,
      fontSize: theme.fontSize.font14,
      color: theme.colors.black,
    },
    label3: {
      fontFamily: theme.fontType.regular,
      fontSize: theme.fontSize.font14,
      color: theme.colors.green,
    },
    label4:{
      fontFamily: theme.fontType.regular,
      fontSize: theme.fontSize.font14,
      color: theme.colors.black,
    },
    mainPostCont: {
      backgroundColor: theme.colors.white,
      margin: 10,
      borderRadius: 12,
      shadowColor: 'lightgray',
      shadowOffset: { width: 1, height: 3 },
      shadowOpacity: 0.9,
      shadowRadius: 2,
    },
    listContainer: {
      borderRadius: theme.borderRadius.radius16,
      borderWidth: theme.borderWidth.borderWidth1,
      borderColor: theme.colors.black,
      paddingVertical: verticalScale(6),
      paddingHorizontal: normalScale(6),
      backgroundColor: theme.colors.lightRed,
      flexDirection: 'row',
      marginTop: verticalScale(13),
      marginHorizontal: 10
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
      marginBottom: verticalScale(7),
      maxWidth: normalScale(200),
    },
    event: {
      height: 32,
      width: 32,
      // marginLeft: normalScale(10),
    },
    row: {
      flexDirection: 'row',
      marginTop: 10,
    },
    pin: {
      height: normalScale(14),
      width: normalScale(14),
      marginRight: normalScale(8),
      marginTop:6
    },
    location: {
      fontFamily: theme.fontType.light,
      fontSize: theme.fontSize.font12,
      color: theme.colors.black,
      marginTop:6
    },
    fullAddress: {
      fontFamily: theme.fontType.light,
      fontSize: theme.fontSize.font12,
      color: theme.colors.black,
      marginTop:6
    },
    addressDot: {
      height: 6,
      width: 6, 
      marginTop:10,
      marginHorizontal: 5
    },
    sposerLabel: {
      position: 'absolute',
      right: -32,
      top: 30,
      zIndex: 11112222
    },
    gretitude: {
      height: 20,
      width: 20,
      position: 'absolute',
      right: 12,
      bottom: 5
    },
    dateContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: verticalScale(10),
      marginHorizontal: 10,
      padding: 10,
      borderRadius: 12,
      backgroundColor: theme.colors.white,
      shadowColor: 'lightgray',
      shadowOffset: { width: 1, height: 3 },
      shadowOpacity: 0.9,
      shadowRadius: 2,
    },
    calendar: {
      height: normalScale(20),
      width: normalScale(20),
    },
    date: {
      marginHorizontal: normalScale(5),
      fontFamily: theme.fontType.regular,
      fontSize: theme.fontSize.font12,
      color: theme.colors.black,
    },
    arrowDown: {
      width: 12,
      height: 12,
      // marginBottom:12
    },
    posttitle: {
      textAlign: 'center',
      color: '#007112',
      fontSize: 16,
      fontFamily: theme.fontType.regular,
      marginTop:3
    },
    feedContainer: {
      marginHorizontal: 10,
      marginVertical: 10,
      borderColor: theme.colors.green,
      borderWidth: 3,
      borderRadius: 8,
      paddingBottom: 14,
      overflow:'hidden'
    },
    postfilterImage: {
      height: 22,
      width: 22,
    },
    postProfile: {
      height: 35,
      width: 35,
      borderRadius: 100,
      marginRight: 10,
      alignItems: 'center',
      marginTop: 1
    },
    userDetailcont: {
      marginHorizontal: 10,
      flexDirection: 'row',
    },
    userName: {
      color: theme.colors.black,
      fontSize: 16,
      fontFamily: theme.fontType.regular,
    },
    postTime: {
      color: theme.colors.purple,
      fontSize: 14,
      fontFamily: theme.fontType.regular,
    },
    postDes: {
      textAlign: 'left',
      color: theme.colors.black,
      fontSize: 12,
      fontFamily: theme.fontType.regular,
      marginHorizontal: 15,
      marginVertical: 10,
      lineHeight:20
    },
    userPost: {
      height: 500,
      width: 'auto',
      marginHorizontal: 10,
      marginBottom: 20,
      borderRadius: 10
    },
    scrollViewStyle: {
      paddingBottom: verticalScale(100),
    },
  scrollView: {
    // flex:1
      paddingBottom: verticalScale(100),
      // paddingHorizontal: normalScale(22),
    },
    postDetail: {
      color: theme.colors.black,
      fontSize: 12,
      fontFamily: theme.fontType.regular,
      marginRight: 5
    },
    postDetailCont: {
      flexDirection: 'row',
      marginHorizontal: 20,
      marginBottom: 5
    },
    detailImage: {
      height: 14,
      width: 14,
      marginRight: 8
    },
    likeCount: {
      color: theme.colors.black,
      fontSize: 12,
      fontFamily: theme.fontType.regular,
    },
    commentImage: {
      height: 14,
      width: 14,
      marginLeft:5
    },
    msgCount: {
      color: theme.colors.black,
      fontSize: 12,
      fontFamily: theme.fontType.regular,
    },
    commentTitle: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginHorizontal: 13
    },
    commentCont: {
      flexDirection: 'row'
    },
    commentContTwo: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      paddingTop:2,
      paddingBottom:2
    },
    commentImgTwo: {
      height: 23,
      width: 23
    },
    commentContShow: {
      fontSize: 12,
      color: '#000000',
      marginHorizontal: 13,
      marginTop: 2
    },
    commentImgProfile: {
      marginLeft: 16,
      marginRight: 30,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      marginVertical:6,
      overflow:'hidden'
    },
    commentDisplayCont: {
      backgroundColor: '#E6E6E6',
      borderWidth: 2,
      borderColor: '#C2DBC6',
      height: 'auto',
      borderRadius: 20,
      width: 230,
      paddingHorizontal: 10,
      paddingTop: 6,
      paddingBottom: 6
    },
    replyMsgCont: {
      fontSize: 12,
      color: '#110101',
      paddingTop: 2,
      paddingLeft: 14,
    },
    replyImg: {
      height: 24,
      width: 24,
    },
    replyContainer: {
      flexDirection: 'row',
      marginLeft: 80,
      marginTop: 2,
    },
    replyLbl: {
      fontSize: 12,
      marginLeft: 10,
      marginTop: 4
    },
    minuteCont: {
      fontSize: 12,
      marginLeft: 16,
      marginTop: 4
    },
    commentImgProfileTwo: {
      flexDirection: 'row',
      marginLeft: 20,
      justifyContent:'center',
      marginTop: 2,
      overflow:'hidden'
    },
    replyContainerTwo: {
      flexDirection: 'row',
      justifyContent:'center',
      marginLeft: 30,
      // marginLeft: 145,
      marginVertical:10,
      // marginTop: 2,
    },
    replyIcon: {
      height: 9,
      width: 10,
      marginTop: 6,
      marginRight: 4
    },
    replyMoreLbl: {
      fontSize: 12,
      marginTop: 4, 
      marginRight: 50
    },
    textOne:{
      color: theme.colors.black,
      fontSize: 14,
      fontFamily: theme.fontType.regular,
      // marginRight:2,
      fontWeight:'600'
    },
    createPostModal:{
      borderTopRightRadius: 24,
      borderTopLeftRadius: 24,
      // paddingVertical: verticalScale(20),
      paddingHorizontal:8,
      marginHorizontal: 7,
    },
    createPostCont:{
      flexDirection:'row',
      alignItems:'center'
    },
    postInputTwo: {
      borderRadius: 10,
      width: width - 215,
      marginLeft: 3,
      paddingHorizontal: 10,
      height:35,
      justifyContent:'center',
      borderColor:theme.colors.black,
      borderWidth:theme.borderWidth.borderWidth1,
      backgroundColor: theme.colors.lightgrayTwo,
    },
    postInputToType: {
      borderRadius: 10,
      width: width - 130,
      marginLeft: 3,
      paddingHorizontal: 10,
      height:35,
      justifyContent:'center',
      borderColor:theme.colors.black,
      borderWidth:theme.borderWidth.borderWidth1,
      backgroundColor: theme.colors.lightgrayTwo,
      marginRight:8
    },

    postdate: {
      borderRadius: 10,
      // marginLeft: 10,
      // paddingHorizontal: 10,
      alignItems:'center',
      flexDirection:'row'
    },

    QuantityContainer:{
      flexDirection:'row',
      borderColor:theme.colors.black,
      borderWidth:theme.borderWidth.borderWidth1,
      backgroundColor: theme.colors.lightgrayTwo,
      borderRadius: 8,
      paddingHorizontal:5,
      paddingVertical:4,
      marginHorizontal:5,
      shadowColor: 'lightgray',
      shadowOffset: { width: 2, height: 3 },
      shadowOpacity: 0.9,
      shadowRadius: 2,
    },

    QuantityMinus:{
      marginHorizontal:6,
      color:theme.colors.black, 
      fontSize:theme.fontSize.font14,
      fontFamily:theme.fontType.medium
    },

    QuantityMunber:{
      color:theme.colors.black, 
      fontSize:theme.fontSize.font14,
      fontFamily:theme.fontType.bold,
      
    },

    QuantityPlus:{
      marginHorizontal:6,
      color:theme.colors.black, 
      fontSize:theme.fontSize.font14,
      fontFamily:theme.fontType.medium
    },
    createImgOne:{
      height:20,
      width:20,
      marginRight:5,
    },
    calenderImage:{
      height:20,
      width:20,
      marginLeft:70,
    },
    quntitiyInput:{
      width:90,
      height:30,
      backgroundColor:'lightgray',
      borderRadius:12,
      paddingHorizontal:5
    },
    quntitiyCont:{
      flexDirection:'row',
      marginTop:10,
      marginBottom:10,
      alignItems:'center',
    },
    postCont:{
      // marginTop:10
    },
    postinput:{
      height:160,
      marginTop:5,
      borderRadius:12,
      paddingHorizontal:5,
      borderColor:theme.colors.black,
      borderWidth:theme.borderWidth.borderWidth1,
      backgroundColor: theme.colors.lightgrayTwo,
    },
    tagCont:{
      marginTop:10,
      flexDirection:'row',
      alignItems:'center'
    },
    tagInput:{
    height:30,
    width:150,
    borderRadius:8,
    paddingHorizontal:5,
    marginLeft:10,
    borderColor:theme.colors.black,
    borderWidth:theme.borderWidth.borderWidth1,
    backgroundColor: theme.colors.lightgrayTwo,
    },
    imagesCont:{
      flexDirection:'row',
      marginTop:10
    },
    textTwo:{
      color: theme.colors.black,
      fontSize: 15,
      fontFamily: theme.fontType.regular,
      marginRight:5,
      fontWeight:'600'
    },
    textThree:{
      color: 'lightgray',
      fontSize: 14,
      fontFamily: theme.fontType.regular,
      marginRight:5,
      fontWeight:'600'
    },
    multipleImagecont:{
    flex: 1,
    flexDirection:'row',
    // width : '100%',
    flexWrap: 'wrap',
    },
    selectImage: {
      height: 90,
      width: 90,
      borderRadius: 18,
      marginRight: 10,
      marginTop: 12
    },
    postClass:{
      borderColor:'green',
      borderWidth:2,
      borderRadius:10,
      paddingVertical:10,
      paddingHorizontal:5,
      margin:10
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
    gratiescontainer:{
      height:180,
      borderColor:'green',
      borderWidth:2,
      borderRadius:10,
      backgroundColor: 'rgba(255, 255, 255, 10)',
      bottom:15,
      margin:16,
      padding:10
    },
    gratiesTitle:{
      fontFamily: theme.fontType.medium,
      fontSize: theme.fontSize.font16,
      color: theme.colors.black,
      marginBottom:10,
      textAlign:'center'
    },
    gratisimg:{
      height:45,
      width:45
    },
    gratistext:{
      fontFamily: theme.fontType.bold,
      fontSize: theme.fontSize.font14,
      color: theme.colors.black,
      fontWeight:'600',
    },
    gratisCont:{
      flexDirection:'row',
      marginVertical:5,
      marginRight:20,
      position:'absolute',
      right:-10,
    },
    commentInput:{
      height:40,
      width:width-90,
      backgroundColor:'lightgray',
      borderRadius:12,
      paddingVertical:5,
      marginVertical:10,
      marginHorizontal:10,
      padding:10
    },
    commentContainer:{
      height:200,
      borderColor:'green',
      borderWidth:2,
      borderRadius:10,
      backgroundColor: 'rgba(255, 255, 255, 10)',
      margin:20,
      padding:10,
      // justifyContent:'center'
    },
    createPostContTwo:{
      flexDirection:'row',
      alignItems : 'flex-start'
    },
    textTwoWhere:{
      color: theme.colors.black,
      fontSize: 14,
      fontFamily: theme.fontType.regular,
      marginRight:3,
      fontWeight:'600',
      paddingTop : 9
    },
    createImgTwo:{
      height:20,
      width:20,
      marginTop : 8,
      marginHorizontal:5
    },
    keyboardView: {
      position: 'absolute',
      // top:650,
      bottom: 0,
      left: 0,
      right: 0,
    },
    containerGallery:{
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.colors.modalOverlay,
    },
    gesture: {
      flex: 1,
    },
    
  });
};
