import { width } from '@theme/device/device';
import { normalScale, verticalScale } from '@theme/device/normalize';
import {ThemeProps} from '@theme/theme';
import {StyleSheet} from 'react-native';

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
      // position: 'relative',
    },
    localText: {
      textAlign: 'center',
      fontSize: 14,
      fontWeight: '400',
      color: 'white',
      position:'relative',
      bottom:13
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
      fontFamily: theme.fontType.regular,
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
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginRight: normalScale(2),
      marginLeft: normalScale(2),
      shadowColor: theme.colors.black,
      shadowOpacity: theme.opacity.opacity15,
      shadowRadius: theme.borderRadius.radius8,
      backgroundColor: 'rgba(255, 255, 255, 0.83)',
      borderWidth: theme.borderWidth.borderWidth1,
      borderColor: theme.colors.black,
      width:110,
      shadowOffset: {
        width: 0,
        height: verticalScale(0),
      },
      elevation: 5,
    },
    icon1:{
      height: normalScale(30),
      width: normalScale(30),
      marginRight: normalScale(8),
    },
    label1: {
      fontFamily: theme.fontType.regular,
      fontSize: theme.fontSize.font14,
      // justifyContent: 'center',
      // alignItems: 'center',
    },
    filterTags:{
      flexDirection:'row',
      zIndex: 11122222,
      alignSelf:'center',
      position:'absolute',
      top:-15
    },
    avatarImage:{
      height:60,
      width:60,
      borderRadius:100,
      marginLeft:10
    },
    avatarContainer:{
      position:'absolute',
      top:600,
      // flex:1,
      // zIndex:11112222
    },
    avatar:{
      height:40,
      width:40,
      borderRadius:100,
      marginLeft:10,
    },
    postInput:{
      backgroundColor:'lightgray', 
      borderRadius:22, 
      width:width - 90,
      marginLeft:10,
      paddingHorizontal:10

    },
    postContainer:{
      marginVertical:10,
      flexDirection:'row',
    },
    postFilter:{
      flexDirection:'row',
      justifyContent:'center'
    },
    container3: {
      borderRadius: theme.borderRadius.radius20,
      paddingVertical: verticalScale(6),
      paddingHorizontal: normalScale(6),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginRight: normalScale(2),
      marginLeft: normalScale(2),
      width:110,
      elevation: 5,
    },
    label2: {
      fontFamily: theme.fontType.regular,
      fontSize: theme.fontSize.font12,
      color: theme.colors.black,
    },
    mainPostCont:{
      backgroundColor:theme.colors.white,
      margin:10,
      borderRadius:12,
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
      paddingHorizontal:normalScale(6),
      backgroundColor: theme.colors.white,
      flexDirection: 'row',
      marginTop: verticalScale(13),
      marginHorizontal:10,
      width:width-25
    },
    
    dummy: {
      width: normalScale(80),
      height: verticalScale(92),
      marginRight: normalScale(18),
      borderRadius: theme.borderRadius.radius10,
    },
    flex: {
      flex: 1,
      overflow:'hidden',
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
      marginTop:12,
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
    sposerLabel:{
      position:'absolute',
      right:-32,
      top:30,
      zIndex:11112222
    },
    gretitude:{
      height:20,
      width:20,
      position:'absolute',
      right:12,
      bottom:0
    },
    dateContainer: {
      flexDirection: 'row',
      alignSelf: 'center',
      marginTop: verticalScale(10),
      marginHorizontal:10,
      paddingVertical:12,
      paddingHorizontal:6,
      borderRadius:12,
      backgroundColor:theme.colors.white,
      shadowColor: 'lightgray',
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.9,
    shadowRadius: 2,
    position:'absolute',
    top:30
    },
    calendar: {
      height: normalScale(20),
      width: normalScale(20),
    },
    date: {
      marginHorizontal: normalScale(4),
      fontFamily: theme.fontType.regular,
      fontSize: theme.fontSize.font14,
      color: theme.colors.black,
    },
    arrowDown: {
      width: normalScale(10),
      height: verticalScale(5),
      marginVertical:5
    },
    posttitle:{
      textAlign:'center',
      color:theme.colors.green,
      fontSize:16,
      fontFamily: theme.fontType.regular,
    },
    feedContainer:{
      marginHorizontal:10,
      marginVertical:10,
      borderColor:theme.colors.green,
      borderWidth:1,
      borderRadius:8
    },
    postfilterImage:{
      height:20,
      width:20,
      position:'absolute',
      right:10,
      top:10
    },
    postProfile:{
      height:35,
      width:35,
      borderRadius:100,
      marginRight:10
    },
    userDetailcont:{
      marginHorizontal:10,
      flexDirection:'row',
    },
    userName:{
      color:theme.colors.black,
      fontSize:16,
      fontFamily: theme.fontType.regular,
    },
    postTime:{
      color:theme.colors.purple,
      fontSize:14,
      fontFamily: theme.fontType.regular,
    },
    postDes:{
      textAlign:'left',
      color:theme.colors.black,
      fontSize:12,
      fontFamily: theme.fontType.regular,
      marginHorizontal:15,
      marginVertical:10
    },
    userPost:{
      height:500,
      width:'auto',
      marginHorizontal:10,
      marginBottom:20,
      borderRadius:10
    },
    scrollView: {
      paddingBottom: verticalScale(100),
    },
    postDetail:{
      color:theme.colors.black,
      fontSize:12,
      fontFamily: theme.fontType.regular,
      marginRight:5
    },
    postDetailCont:{
      flexDirection:'row',
      marginHorizontal:20,
      marginBottom:5
    },
    detailImage:{
      height:14,
      width:14,
      marginRight:8
    },
    likeCount:{
      color:theme.colors.black,
      fontSize:12,
      fontFamily: theme.fontType.regular,
    },
    commentImage:{
      height:14,
      width:14,
    },
    msgCount:{
      color:theme.colors.black,
      fontSize:12,
      fontFamily: theme.fontType.regular,
    },
    commentTitle:{
      flexDirection:'row',
      justifyContent:'space-between'
    },
    commentCont:{
      flexDirection:'row'
    },
    buttonCallout: {
      flex: 1,
      // flexDirection:'row',
      position:'absolute',
      top:230,
      right:0,
      alignSelf: "center",
      justifyContent: "space-between",
      backgroundColor: "transparent",
    },
    touchable: {
      backgroundColor: "white",
      padding: 8,
      margin: 5
    },
    plusClass: {
     height:20,
     width:20
    },

  });
};
