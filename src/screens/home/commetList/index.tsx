import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useAppTheme} from '@app-hooks/use-app-theme';

import {
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  LogBox,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {createStyleSheet} from '../style';
import {ImageComponent} from '@components/image-component';
import {
  Gratis,
  Vector,
  arrowLeft,
  buttonArrowGreen,
  closeCard,
  comment,
  gratisGreen,
  gratitudeBlack,
  minus,
  onelogo,
  plus,
  send,
} from '@assets/images';
import {ScrollView} from 'react-native-gesture-handler';
import GestureRecognizer from 'react-native-swipe-gestures';
import Toast from 'react-native-simple-toast';
import {API_URL} from '@network/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {navigations} from '@config/app-navigation/constant';
import {NavigationContainerRef, ParamListBase} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

interface commentListProps {
  navigation: NavigationContainerRef<ParamListBase>;
}

export const CommentList = (props: commentListProps) => {
  const {theme} = useAppTheme();
  const styles = createStyleSheet(theme);
  const [offerModal, CreateOfferModal] = useState(false);
  const [replyofferModal, openReplyOfferModal] = useState(false);
  var [gratisNo, totalGratisData]: any = useState(10);
  const {navigation} = props || {};
  var [gratisNoComment, totalGratisCommentData]: any = useState(10);
  var [addComment, addCommentModal] = useState(false);
  var [showComment, showCommentPost] = useState(false);
  const [addnewCmtReply, onAddCommentReply] = useState('');
  var [postId, postIdData]: any = useState();
  var [gratisIndex, gratisIndexData]: any = useState();
  const [isLoading, LodingData] = useState(false);
  const initialValue = 1;
  const [pageCmt, setCmtPage] = useState(initialValue);
  const [addnewCmt, onAddComment] = useState('');
  const [commentLoading, onPageLoadComment] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPages, setCurrentPage] = useState(0);
  const [commentList, setCommentListData]: any = useState([]);
  const [commentListScrollEnable, setCommentListScrollEnable] = useState(true);
  const flatlistRef = useRef<FlatList>(null);

  useEffect(() => {
    LogBox.ignoreAllLogs();
    getCommentListAPI();
  }, [pageCmt]);

  async function getCommentListAPI() {
    // postList[index]['commentListData'] = [];
    const token = await AsyncStorage.getItem('token');
    const commentId = await AsyncStorage.getItem('commentID');
    var data: any = {
      post_id: commentId,
    };
    console.log('===========Get Comment List API Request ==============');
    console.log(
      API_URL +
        '/v1/comments?limit=25&+page=' +
        pageCmt +
        '&post_id=' +
        commentId,
    );
    console.log(data);
    try {
      const response = await fetch(
        API_URL +
          '/v1/comments?limit=25&page=' +
          pageCmt +
          '&post_id=' +
          commentId,
        {
          method: 'post',
          headers: new Headers({
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify(data),
        },
      );

      // setCmtPage(pageCmt)
      const dataItem = await response.json();
      console.log('===========Get Comment List API Response ==============');
      console.log(dataItem);
      LodingData(false);
      var dataTemp = [...commentList, ...dataItem?.data.results];
      setCommentListData(dataTemp);

      onPageLoadComment(false);
      setTotalPages(dataItem?.data?.totalPages);
      setCurrentPage(dataItem?.data?.page);
      if (dataItem?.data?.page === dataItem?.data?.totalPages) {
      }
    } catch (error) {
      LodingData(false);
      console.error(error);
    }
  }

  async function commentOnPost() {
    const commentId = await AsyncStorage.getItem('commentID');
    const token = await AsyncStorage.getItem('token');
    var data: any = {
      content: addnewCmt,
    };
    console.log('===========Comment on Post API Request ==============');
    console.log(data);
    console.log(API_URL + '/v1/posts/' + commentId + '/comments/create');
    try {
      const response = await fetch(
        API_URL + '/v1/posts/' + commentId + '/comments/create',
        {
          method: 'post',
          headers: new Headers({
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify(data),
        },
      );
      const dataItem = await response.json();

      // postID.isComment = true;
      console.log('=========== Comment on Post API Response ==============');
      console.log(JSON.stringify(dataItem));
      onAddComment('');
      onAddCommentReply('');
      getCommentListAPITwo(commentId);
      setCommentListScrollEnable(true);
      LodingData(false);
    } catch (error) {
      LodingData(false);
      console.error(error);
    }
  }

  async function getCommentListAPITwo(postID: any) {
    // postList[index]['commentListData'] = [];
    // isMoreCommentData(true);
    const token = await AsyncStorage.getItem('token');
    var data: any = {
      post_id: postID,
    };
    console.log(
      API_URL + '/v1/comments?limit=25&+page=1' + '&post_id=' + postID,
    );
    console.log(data);
    try {
      const response = await fetch(
        API_URL + '/v1/comments?limit=25&page=1' + '&post_id=' + postID,
        {
          method: 'post',
          headers: new Headers({
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify(data),
        },
      );

      // setCmtPage(pageCmt)
      const dataItem = await response.json();
      console.log(dataItem);
      LodingData(false);
      var cmtList = dataItem?.data?.results;

      let markers = [...commentList];

      // markers[index]['commentListData'] = [...cmtList];

      setCommentListData(markers);
      // flatlistRef?.current?.scrollToIndex({index: 0});
      flatlistRef?.current?.scrollToOffset({animated: true, offset: 0});
      console.log(
        '-----------comment List-------------',
        // commentList[index]['commentListData'],
      );

      onPageLoadComment(false);
      setTotalPages(dataItem?.data?.totalPages);
      setCurrentPage(dataItem?.data?.page);
      if (pageCmt > dataItem?.data?.totalPages) {
        // isMoreCommentData(false);
      }
      // setCommentListScrollEnable(true);
    } catch (error) {
      LodingData(false);
      console.error(error);
    }
  }

  const CommentListCall = (post_id: any, indexId: any) => {};

  const onReplyClick = (postId: any) => {
    addCommentModal(true);
  };

  const openReplyGratis = (
    postIds: any,
    replyId: any,
    replyKey: any,
    index: any,
    cindex: any,
  ) => {};

  const OfferModalClose = () => {
    CreateOfferModal(false);
  };

  const gratisPlusClick = () => {
    gratisNo = gratisNo + 1;
    totalGratisData(gratisNo);
  };
  const gratisMinusClick = () => {
    if (gratisNo > 10) {
      gratisNo = gratisNo - 1;
      totalGratisData(gratisNo);
    }
  };

  const gratisCommentPlusClick = () => {
    gratisNoComment = gratisNoComment + 1;
    totalGratisCommentData(gratisNoComment);
  };
  const gratisCommrntMinusClick = () => {
    if (gratisNoComment > 10) {
      gratisNoComment = gratisNoComment - 1;
      totalGratisCommentData(gratisNoComment);
    }
  };

  const OfferModalHide = () => {
    CreateOfferModal(false);

    // addGratisAPI();
  };

  const replyOfferModalHide = () => {
    openReplyOfferModal(false);
    // addReplyGratisAPI();
  };

  const keyboardDismiss = () => {
    Keyboard.dismiss();
  };

  const onReplyClose = () => {
    if (addnewCmtReply === '') {
      Toast.show('Add Comment', Toast.LONG, {
        backgroundColor: 'black',
      });
    } else {
      //   LodingData(true);
      //   replyCommentOnPostAPI();
      addCommentModal(false);
    }
  };

  const addCommentHide = () => {
    if (addnewCmt === '') {
      Toast.show('Add Comment', Toast.LONG, {
        backgroundColor: 'black',
      });
    } else {
      LodingData(true);
      commentOnPost();
    }
  };

  const onBackPress = () => {
    navigation.goBack();
  };

  const postDataLoad = useCallback(() => {
    // if(ismoreCommentLoad)
    console.log(currentPages, '===============currentPages 111===========');
    console.log(
      totalPages,
      '==================totalPages 1111==================',
    );
    if (pageCmt < totalPages) {
      console.log(currentPages, '===============currentPages===========');
      console.log(totalPages, '==================totalPages==================');
      setCommentListScrollEnable(false);
      onPageLoadComment(true);
      setCmtPage(pageCmt + 1);
    }
  }, [pageCmt]);

  return (
    <View>
      <TouchableOpacity style={styles.HeaderContainerTwo} activeOpacity={1}>
        <TouchableOpacity style={styles.row2} onPress={onBackPress}>
          <View>
            <ImageComponent source={arrowLeft} style={styles.arrowLeft} />
          </View>
        </TouchableOpacity>
        <View style={styles.oneContainer}>
          <ImageComponent
            style={styles.oneContainerImage}
            source={onelogo}></ImageComponent>
          <Text style={styles.oneContainerText}>NE</Text>
        </View>
      </TouchableOpacity>
      <View>
        <KeyboardAwareScrollView contentContainerStyle={{paddingBottom: 350}}>
          <FlatList
            ref={flatlistRef}
            keyExtractor={item => item.id}
            onEndReachedThreshold={0.8}
            onEndReached={() => {
              console.log('-------------onEndReached---------------');
              if (commentListScrollEnable) {
                postDataLoad();
              }
            }}
            data={commentList}
            renderItem={({item, index}) => (
              <View>
                <View style={styles.commentImgProfile}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    // onPress={() => recentUserProfilePress(item?.user_id.id)}
                  >
                    <ImageComponent
                      resizeMode="cover"
                      style={styles.postProfile}
                      source={{
                        uri: item?.commenter?.pic,
                      }}></ImageComponent>
                  </TouchableOpacity>
                  <View style={styles.commentDisplayCont}>
                    <Text style={{fontSize: 12, color: '#110101'}}>
                      {item?.commenter?.first_name} {item?.commenter?.last_name}
                    </Text>
                    <Text style={styles.replyMsgCont}>{item?.content}</Text>
                  </View>
                </View>

                <View style={styles.replyContainer}>
                  <ImageComponent
                    source={Vector}
                    style={styles.vectorImg}></ImageComponent>
                  <TouchableOpacity onPress={() => onReplyClick(item.id)}>
                    <Text style={styles.replyLbl}>reply</Text>
                  </TouchableOpacity>

                  <Text style={styles.minuteCont}>{item.date}</Text>
                  <Text style={styles.minuteCont}>{item.gratis}</Text>
                  <TouchableOpacity
                  // onPress={() =>
                  //   openReplyGratis(item.post_id, item.id, '', indexParent, index)}
                  >
                    <ImageComponent
                      resizeMode="cover"
                      style={styles.replyImg}
                      source={gratisGreen}></ImageComponent>
                  </TouchableOpacity>
                </View>

                {/* {commentList?.reply?.content ? ( */}

                {item.reply.map((subItem: any, jindex: any) => {
                  return (
                    <>
                      <View>
                        <View style={styles.commentImgProfileTwo}>
                          <ImageComponent
                            resizeMode="cover"
                            style={styles.postProfile}
                            source={{
                              uri: subItem?.commenter?.pic,
                            }}></ImageComponent>
                          <View
                            style={[styles.commentDisplayCont, {width: 210}]}>
                            <Text
                              style={{
                                fontSize: 12,
                                color: '#110101',
                              }}>
                              {subItem.commenter.first_name}{' '}
                              {subItem.commenter.last_name}
                            </Text>
                            <Text style={styles.replyMsgCont}>
                              {subItem.content}
                            </Text>
                          </View>
                        </View>

                        <View style={styles.replyContainerTwo}>
                          <ImageComponent
                            source={Vector}
                            style={styles.vectorImgTwo}></ImageComponent>
                          <TouchableOpacity
                          // onPress={() => onReplyClick(item.id, indexParent)}
                          >
                            <Text style={styles.replyLbl}>reply</Text>
                          </TouchableOpacity>

                          <Text style={styles.minuteCont}>{subItem.date}</Text>
                          <Text style={styles.minuteCont}>
                            {subItem.gratis}
                          </Text>
                          <TouchableOpacity
                          // onPress={() =>
                          //   openReplyGratis(
                          //     item.post_id,
                          //     item.id,
                          //     subItem.key,
                          //     indexParent,
                          //     index,
                          //   )}
                          >
                            <ImageComponent
                              style={styles.replyImg}
                              source={gratisGreen}></ImageComponent>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </>
                  );
                })}
              </View>
            )}></FlatList>

          <View style={styles.bottomButton}>
            <View style={{flexDirection: 'row'}}>
              <TextInput
                style={styles.commentInput}
                placeholder="Make a Comment"
                value={addnewCmt}
                onChangeText={text => onAddComment(text)}></TextInput>
              <TouchableOpacity
                style={{alignSelf: 'center'}}
                onPress={() => addCommentHide()}>
                <ImageComponent
                  style={{height: 40, width: 40}}
                  source={send}></ImageComponent>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
      <Modal transparent onDismiss={OfferModalClose} visible={offerModal}>
        <GestureRecognizer onSwipeDown={OfferModalClose} style={styles.gesture}>
          <TouchableOpacity
            style={styles.containerGallery}
            activeOpacity={1}
            onPress={OfferModalClose}
          />
        </GestureRecognizer>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}>
          <TouchableOpacity activeOpacity={1} style={styles.gratiescontainer}>
            <View>
              <Text style={styles.gratiesTitle}>Give some Gratis</Text>
              <View style={styles.gratisCont}>
                <TouchableOpacity onPress={gratisMinusClick}>
                  <ImageComponent
                    source={minus}
                    style={{
                      height: 30,
                      width: 30,
                      marginRight: 50,
                    }}></ImageComponent>
                </TouchableOpacity>
                <ImageComponent
                  resizeMode="cover"
                  style={styles.gratisimg}
                  source={Gratis}></ImageComponent>
                <Text style={styles.gratistext}>{gratisNo}</Text>
                <TouchableOpacity onPress={gratisPlusClick}>
                  <ImageComponent
                    source={plus}
                    style={{
                      height: 30,
                      width: 30,
                      marginLeft: 50,
                    }}></ImageComponent>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => OfferModalHide()}
                activeOpacity={0.8}
                style={styles.purchaseContainer}>
                <View />
                <Text style={styles.titleTwo}>Give</Text>
                <TouchableOpacity>
                  <ImageComponent
                    source={buttonArrowGreen}
                    style={styles.buttonArrow}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Modal>

      <Modal
        transparent
        onDismiss={() => openReplyOfferModal(false)}
        visible={replyofferModal}>
        <GestureRecognizer
          onSwipeDown={() => openReplyOfferModal(false)}
          style={styles.gesture}>
          <TouchableOpacity
            style={styles.containerGallery}
            activeOpacity={1}
            onPress={() => openReplyOfferModal(false)}
          />
        </GestureRecognizer>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}>
          <TouchableOpacity activeOpacity={1} style={styles.gratiescontainer}>
            <View>
              <Text style={styles.gratiesTitle}>Give some Gratis Comment</Text>
              <View style={styles.gratisCont}>
                <TouchableOpacity onPress={gratisCommrntMinusClick}>
                  <ImageComponent
                    source={minus}
                    style={{
                      height: 30,
                      width: 30,
                      marginRight: 50,
                    }}></ImageComponent>
                </TouchableOpacity>
                <ImageComponent
                  resizeMode="cover"
                  style={styles.gratisimg}
                  source={Gratis}></ImageComponent>
                <Text style={styles.gratistext}>{gratisNoComment}</Text>
                <TouchableOpacity onPress={gratisCommentPlusClick}>
                  <ImageComponent
                    source={plus}
                    style={{
                      height: 30,
                      width: 30,
                      marginLeft: 50,
                    }}></ImageComponent>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => replyOfferModalHide()}
                activeOpacity={0.8}
                style={styles.purchaseContainer}>
                <View />
                <Text style={styles.titleTwo}>Give</Text>
                <TouchableOpacity>
                  <ImageComponent
                    source={buttonArrowGreen}
                    style={styles.buttonArrow}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Modal>

      <Modal
        transparent={true}
        visible={offerModal}
        animationType="slide"></Modal>
      <Modal
        transparent={true}
        visible={addComment}
        animationType="slide"
        //  onDismiss={() => addCommentModal(false)}
      >
        <GestureRecognizer
          // onSwipeDown={() => addCommentModal(false)}
          style={styles.gesture}>
          <TouchableOpacity
            style={[styles.containerGallery]}
            activeOpacity={1}
            onPress={keyboardDismiss}
          />
        </GestureRecognizer>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={[
            styles.keyboardView,
            {position: 'absolute', left: 0, right: 0},
          ]}>
          <TouchableOpacity activeOpacity={1} style={styles.commentContainer}>
            <View>
              <TouchableOpacity
                style={{position: 'absolute', right: 0, zIndex: 111122}}
                activeOpacity={0.5}
                onPress={() => addCommentModal(false)}>
                <ImageComponent
                  source={closeCard}
                  style={{height: 25, width: 25}}></ImageComponent>
              </TouchableOpacity>
              <Text style={styles.gratiesTitle}>Add Comment</Text>
              <View>
                <TextInput
                  style={styles.commentInput}
                  placeholder="Comment"
                  onChangeText={text => onAddCommentReply(text)}></TextInput>
              </View>
              <TouchableOpacity
                onPress={() => onReplyClose()}
                activeOpacity={0.8}
                style={styles.purchaseContainer}>
                <View />
                <Text style={styles.titleTwo}>Add Comment</Text>
                <View>
                  <ImageComponent
                    source={buttonArrowGreen}
                    style={styles.buttonArrow}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};
