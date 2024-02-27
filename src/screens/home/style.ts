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
      backgroundColor: theme.colors.headerColor,
      height: 150,
    },
    row2: {
      position: 'absolute',
      top: 45,
      left: 10,
      height: normalScale(30),
      width: normalScale(30),
      zIndex: 11111222222
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
      bottom: 30,
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
      // fontFamily: theme.fontType.regular,
      fontFamily: 'NotoSerif-Regular',
      marginLeft: 2,
      marginBottom: -10,
    },
    localText: {
      textAlign: 'center',
      fontSize: 14,
      fontWeight: '400',
      color: 'white',
      position:'relative',
      bottom:3,

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
      zIndex:22323,
      backgroundColor: 'transparent',
      flexDirection: 'row',
      justifyContent: 'center'
    },
    avatarImage: {
      height: 60,
      width: 60,
      borderRadius: 100,
      marginRight: 11,
      marginLeft:2
    },
    gratisAndCommentContainer:{
      flexDirection:'row',
      justifyContent:'space-evenly',
      marginVertical:10
    },
    gratisContainer:{
      flexDirection:'row',
      borderWidth: theme.borderWidth.borderWidth1,
      borderColor: theme.colors.black,
      borderRadius:theme.borderRadius.radius20,
      paddingHorizontal:20,
      paddingVertical:6,
      alignSelf:'center',
    },
    gratisClass:{
      alignSelf:'center',
      marginRight:5
    },
    commentsContainer:{
      flexDirection:'row',
      borderWidth: theme.borderWidth.borderWidth1,
      borderColor: theme.colors.black,
      borderRadius:theme.borderRadius.radius20,
      paddingHorizontal:20,
      paddingVertical:6,
      alignSelf:'center',
    },
    commentImageThree:{
      height:20,
      width:20,
    },
    commentClass:{
      marginRight:5
    },
    avatarContainer: {
      marginLeft: 11,
      marginRight: 11,
      marginTop:20
    },
    avatar: {
      height: 40,
      width: 40,
      borderRadius: 100,
      marginLeft: 10,
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
    containerFocus: {
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
      borderWidth: theme.borderWidth.borderWidth2,
      borderColor: theme.colors.black,
      width: 110,
      shadowOffset: {
        width: 0,
        height: verticalScale(2),
      },
      elevation: 5,
      // position:'absolute',
      top: -20
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
      shadowOffset: { width: 1, height: 2 },
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
      height: normalScale(22),
      width: normalScale(22),
    },
    date: {
      marginHorizontal: normalScale(5),
      fontFamily: theme.fontType.regular,
      fontSize: theme.fontSize.font12,
      color: theme.colors.black,
    },
    arrowDown: {
      width: normalScale(12),
      height: verticalScale(8),
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
      marginVertical: 6,
      borderColor: theme.colors.green,
      borderWidth: 3,
      borderRadius: 8,
      paddingBottom: 14,
      paddingTop: 8,
      backgroundColor:theme.colors.white,
      shadowColor: theme.colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.9,
      shadowRadius: 8,  
      elevation: 5
    },
    postfilterImage: {
      height: 22,
      width: 22,
    },
    postProfile: {
      height: 40,
      width: 40,
      borderRadius: 100,
      marginRight: 10,
      alignItems: 'center',
      marginTop: 7
    },
    userDetailcont: {
      marginHorizontal: 10,
      flexDirection: 'row',
    },
    postTime: {
      color: theme.colors.gray,
      fontSize: 14,
      fontFamily: theme.fontType.regular,
      paddingTop:4
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
      height: 300,
      // width: 'auto',
      marginHorizontal: 10,
      marginBottom: 20,
      borderRadius: 10
    },
    scrollViewStyle: {
      paddingBottom: verticalScale(100),
    },
  scrollView: {
    // flex:1
      paddingBottom: verticalScale(140),
      // paddingHorizontal: normalScale(22),
    },
    scrollViewComment:{
      paddingBottom: verticalScale(110),
    },
    postDetail: {
      color: theme.colors.black,
      fontSize: 12,
      fontFamily: theme.fontType.regular,
      // marginRight: 5,
      width:width - 110,
    },
    postDetailTitle:{
      color: theme.colors.black,
      fontSize: 12,
      fontFamily: theme.fontType.regular,
      marginRight: 5,
    },
    postDetailCont: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      marginBottom: 5,
      marginRight: 8
    },
    detailImage: {
      height: 16,
      width: 16,
      marginRight: 4
      
    },
    userListDisplay:{

      height:25,
      width:25,
      borderRadius:100,
      marginHorizontal:2
    },
    userListDisplayCont:{
      flexDirection: 'row',
      position: 'absolute',
      right: 70, 
      top: 77
    },
    userNameGraties: {
      color: theme.colors.black,
      fontSize: 16,
      fontFamily: theme.fontType.regular,
      width:width-120,
    },
    userName: {
      color: theme.colors.black,
      fontSize: 16,
      paddingTop:7,
      fontFamily: theme.fontType.regular,
      width:width-120,
    },
    userNameTwo:{
      color: theme.colors.black,
      fontSize: 16,
      paddingTop:7,
      fontFamily: theme.fontType.regular,
    },
    sentPointClass:{
      color: theme.colors.gray,
      fontSize: 16,
      fontFamily: theme.fontType.regular,
      flexShrink:1,
      width:width-100
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
      width: 23,
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
      // justifyContent: 'flex-start',
      marginVertical:6,
      // overflow:'hidden'
    },
    bottomButton: {
    justifyContent:'flex-end', 
      paddingHorizontal: normalScale(16),
      backgroundColor: theme.colors.white,
      paddingBottom: verticalScale(25),
      paddingTop: verticalScale(5),
      // backgroundColor: 'red',
    },
    commentDisplayCont: {
      backgroundColor: '#E6E6E6',
      borderWidth: 2,
      borderColor: '#C2DBC6',
      // height: 'auto',
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
      marginLeft: 20,
    },
    replyContainer: {
      flexDirection: 'row',
      marginLeft: 70,
      marginTop: 2,
    },
    replyLbl: {
      color:theme.colors.black,
      fontSize: 12,
      marginTop: 4
    },
    vectorImg:{
      height:10,
      width:10,
      marginTop:6,
      marginRight:1
    },
    vectorImgTwo:{
      height:10,
      width:10,
      marginTop:6,marginRight:5
    },
    minuteCont: {
      fontSize: 12,
      marginLeft: 8,
      marginTop: 4
    },
    commentImgProfileTwo: {
      flexDirection: 'row',
      marginLeft: 20,
      justifyContent:'center',
      marginTop: 5,
      overflow:'hidden'
    },
    replyContainerTwo: {
      flexDirection: 'row',
      justifyContent:'center',
      marginLeft: 65,
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
      marginRight:5,
      fontWeight:'600'
    },
    createPostModal:{
      borderTopRightRadius: 24,
      borderTopLeftRadius: 24,
      paddingVertical: verticalScale(20),
      paddingHorizontal:8,
      borderColor: theme.colors.lightGreen,
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
      borderTopWidth: 4,
      borderLeftWidth: 4,
      borderRightWidth: 4,
      marginHorizontal: 7,
      // flex: 1
    },
    createPostCont:{
      flexDirection:'row',
      alignItems:'center'
    },
    postInputTwo: {
      backgroundColor: 'lightgray',
      borderRadius: 10,
      width: width - 200,
      marginLeft: 10,
      paddingHorizontal: 10,
      height:35,
      justifyContent:'center'
    },
    createImgOne:{
      height:20,
      width:20,
      marginRight:5
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
      marginLeft:50
    },
    postCont:{
      marginTop:10
    },
    postinput:{
      height:160,
      marginTop:5,
      backgroundColor:'lightgray',
      borderRadius:12,
      paddingHorizontal:5
    },
    tagCont:{
      marginTop:10,
      flexDirection:'row',
      alignItems:'center'
    },
    tagInput:{
    height:30,
    backgroundColor:'lightgray',
    width:200,
    borderRadius:12,
    paddingHorizontal:5,
    marginLeft:10
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
    flexDirection:'row'
    },
    selectImage:{
    height:80,
    width:100,
    borderRadius:12,
    marginRight:10,
    marginTop:15
    },
    postClass:{
      borderColor:'green',
      borderWidth:2,
      borderRadius:10,
      padding:10,
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
      fontSize: theme.fontSize.font36,
      color: theme.colors.black,
      fontWeight:'600',
      marginLeft:10
    },
    gratisCont:{
      flexDirection:'row',
      justifyContent:'center',
      alignItems:'center',
      marginVertical:10
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
      marginRight:5,
      fontWeight:'600',
      paddingTop : 9
    },
    createImgTwo:{
      height:20,
      width:20,
      marginTop : 8,
      marginRight:5
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
    containerPost:{
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
    keyboardViewTwo: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      // top:0
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
    postActionSheet:{
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
    postText:{
      textAlign: 'center',
      fontSize: 18,
      fontFamily: theme.fontType.medium,
      backgroundColor: '#A493B7',
      borderRadius:16,
      padding: 10,
      margin: 10,
    },
    MainPostContainer:{
      backgroundColor:theme.colors.darkenBlack,
      flex:1
    },
    commentModalContainer:{ 
      height:'100%',
      // marginTop:80,
      backgroundColor:theme.colors.white,
      borderTopStartRadius:16,
      borderTopEndRadius:16,
  },
  notchCont:{
    borderRadius:20,
    padding:2,
    backgroundColor:theme.colors.black,
    alignSelf:'center',
    width:50,
    marginTop:80,
    marginBottom:20
  },
  getMoreDataCont:{
    fontSize:16,
    color:theme.colors.black,
    padding:10,
    marginVertical:10,
    alignSelf:'center',
    borderRadius:20,
    borderWidth:theme.borderWidth.borderWidth1
  }
  });
};
