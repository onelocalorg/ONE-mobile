import React, { useState } from "react";
import {
  GestureResponderEvent,
  ListRenderItem,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-simple-toast";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { addGreen, save } from "~/assets/images";
import { FlatListComponent } from "~/components/flatlist-component";
import { ImageComponent } from "~/components/image-component";
import { Input } from "~/components/input";
import { Loader } from "~/components/loader";
import { Pill } from "~/components/pill";
import { useMyUserId } from "~/navigation/AuthContext";
import { UserProfile } from "~/types/user-profile";
import { createStyleSheet } from "./style";

interface AboutDataProps {
  user: UserProfile;
  onEditProfile?: (data: { about?: string; skills?: string[] }) => void;
}
export const MyAbout = ({ user, onEditProfile }: AboutDataProps) => {
  const { theme } = useAppTheme();
  const { strings } = useStringsAndLabels();
  const styles = createStyleSheet(theme);
  const { id: userId, about, skills } = user;
  const [updatedAbout, setAbout] = useState(about);
  const [allSkills, setSkills] = useState(skills);
  const [skillValue, setSkillValue]: any = useState("");
  const myUserId = useMyUserId();

  const isMe = myUserId === user.id;

  const handleRemoveSkill = (id: any) => {
    const newPeople = allSkills.filter((person) => person !== id);

    setSkills(newPeople);
  };

  const onAddSkill = (text: any) => {
    const foundSkill = allSkills.find((data: any) => data == text);
    if (!foundSkill) {
      if (text !== "" && text !== undefined) {
        setSkills([...allSkills, text]);
        setSkillValue("");
      }
    } else {
      Toast.show("Already Added", Toast.LONG, {
        backgroundColor: "black",
      });
    }
  };

  const renderItem: ListRenderItem<string> = ({ item }) => (
    <Pill
      onPressPill={() => handleRemoveSkill(item)}
      pillStyle={styles.marginBottom}
      key={item}
      label={item}
    />
  );

  function onSaveProfile(event: GestureResponderEvent): void {
    throw new Error("Function not implemented.");
  }

  // const getTextStyle: any = (itemCss: any) => {
  //   if (itemCss.status) {
  //     return {
  //       borderRadius: theme.borderRadius.radius20,
  //       paddingVertical: verticalScale(6),
  //       paddingHorizontal: normalScale(6),
  //       flexDirection: "row",
  //       justifyContent: "space-between",
  //       alignItems: "center",
  //       marginRight: normalScale(8),
  //       shadowColor: theme.colors.black,
  //       shadowOpacity: theme.opacity.opacity15,
  //       shadowRadius: theme.borderRadius.radius8,
  //       backgroundColor: itemCss.color,
  //       borderWidth: theme.borderWidth.borderWidth1,
  //       borderColor: theme.colors.black,
  //       shadowOffset: {
  //         width: 0,
  //         height: verticalScale(0),
  //       },
  //       elevation: 5,
  //     };
  //   } else {
  //     return {
  //       borderRadius: theme.borderRadius.radius20,
  //       paddingVertical: verticalScale(8),
  //       paddingHorizontal: normalScale(8),
  //       flexDirection: "row",
  //       justifyContent: "space-between",
  //       alignItems: "center",
  //       marginRight: normalScale(8),
  //       shadowColor: theme.colors.black,
  //       shadowOpacity: theme.opacity.opacity15,
  //       shadowRadius: theme.borderRadius.radius8,
  //       backgroundColor: itemCss.color,
  //       // borderWidth:theme.borderWidth.borderWidth1,
  //       // borderColor:theme.colors.black,
  //       shadowOffset: {
  //         width: 0,
  //         height: verticalScale(0),
  //       },
  //       elevation: 5,
  //     };
  //   }
  // };

  // const getTextStyleDetail: any = (itemCss: any) => {
  //   return {
  //     borderRadius: theme.borderRadius.radius20,
  //     paddingVertical: verticalScale(8),
  //     paddingHorizontal: normalScale(8),
  //     flexDirection: "row",
  //     justifyContent: "center",
  //     alignItems: "center",
  //     backgroundColor: itemCss.color,
  //     // marginRight: normalScale(8),
  //     shadowColor: theme.colors.black,
  //     shadowOpacity: theme.opacity.opacity15,
  //     shadowRadius: theme.borderRadius.radius8,
  //     marginLeft: 20,
  //     marginRight: 20,
  //     fontSize: theme.fontSize.font24,
  //     fontFamily: theme.fontType.medium,
  //     borderWidth: theme.borderWidth.borderWidth1,
  //     borderColor: theme.colors.white,
  //     shadowOffset: {
  //       width: 0,
  //       height: verticalScale(0),
  //     },
  //     elevation: 5,
  //   };
  // };

  return (
    <>
      <View style={styles.innerContainer}>
        <Loader visible={false} showOverlay />

        <View style={styles.rowOnly}>
          <Text style={styles.membership}>{strings.membership}</Text>
          <TouchableOpacity activeOpacity={0.8} onPress={onSaveProfile}>
            <ImageComponent source={save} style={styles.save} />
          </TouchableOpacity>
        </View>
        {/* <GestureRecognizer>
              <TouchableOpacity
                onPressOut={() => {
                  setModalVisible(false);
                }}
              >
                <Modal
                  transparent
                  onDismiss={() => setModalVisible(false)}
                  visible={modalVisible}
                >
                  <GestureRecognizer
                    onSwipeDown={() => setModalVisible(false)}
                    style={styles.gesture}
                  >
                    <TouchableOpacity
                      style={styles.containerGallery}
                      activeOpacity={1}
                      onPress={() => setModalVisible(false)}
                    />
                  </GestureRecognizer>
                  <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.keyboardViewTwo}
                  >
                    <View style={styles.packageDetailModal}>
                      <ScrollView
                        showsVerticalScrollIndicator={false}
                        horizontal={false}
                      >
                        <TouchableOpacity
                          activeOpacity={0}
                          onPress={() => {
                            openSettingsModal();
                          }}
                        >
                          <TouchableOpacity
                            style={getTextStyleDetail(postData)}
                            activeOpacity={0.8}
                          >
                            <ImageComponent
                              source={{ uri: postData?.role_image }}
                              style={[styles.icon]}
                            />
                            <Text style={styles.label}>{postData?.title}</Text>
                          </TouchableOpacity>

                          <Text style={styles.playerDescription}>
                            {postData.description}
                          </Text>
                          {postData.status == false ? (
                            <Subscription
                              label={strings.signUp}
                              pillStyle={styles.signUpStyle}
                              backgroundColor={postData.color}
                              onPressPill={() => memberShipClick(postData.id)}
                            />
                          ) : (
                            <View></View>
                          )}
                          <Text style={styles.playerText}>
                            {postData.defaultSignupText}
                          </Text>
                          {postData.status == true ? (
                            <TouchableOpacity onPress={cancelSubscriptionAPI}>
                              <Text style={styles.cancelSubStyle}>
                                {strings.cancelSubscription}
                              </Text>
                            </TouchableOpacity>
                          ) : (
                            <View></View>
                          )}
                        </TouchableOpacity>
                      </ScrollView>
                    </View>
                  </KeyboardAvoidingView>
                </Modal>
              </TouchableOpacity>
            </GestureRecognizer> */}
        {/* <View style={{ flex: 1 }}>
              {packageItem ? (
                <FlatList
                  keyExtractor={(item) => item.id}
                  data={packageItem}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{
                    alignSelf: "center",
                    alignItems: "center",
                  }}
                  columnWrapperStyle={
                    packageItem.length > 1 ? { flexWrap: "wrap" } : undefined
                  }
                  numColumns={packageItem.length}
                  key={packageItem.length}
                  renderItem={({ item, index }) => {
                    return (
                      <View style={styles.containers}>
                        <TouchableOpacity
                          style={getTextStyle(item)}
                          // style={styles.container2}
                          activeOpacity={0.8}
                          onPress={() => {
                            onPlayerClick(item.id);
                          }}
                        >
                          <ImageComponent
                            source={{ uri: item.role_image }}
                            style={[styles.icon1]}
                          />
                          <Text style={styles.label1}>{item.title}</Text>
                        </TouchableOpacity>
                      </View>
                    );
                  }}
                ></FlatList>
              ) : (
                <View />
              )} */}

        <Text style={styles.membership}>
          {isMe ? strings.aboutMe : `About ${user.firstName}`}
        </Text>
        {isMe ? (
          <Input
            inputStyle={styles.input}
            value={updatedAbout}
            placeholder="tell us about yourself!"
            placeholderTextColor="#818181"
            onChangeText={setAbout}
            multiline
          />
        ) : (
          <Text>{user.about}</Text>
        )}

        <Text style={styles.membership}>{strings.skills}</Text>
        {isMe ? (
          <>
            {skillValue !== "" ? (
              <TouchableOpacity
                style={{ zIndex: 1111111 }}
                onPress={() => {
                  onAddSkill(skillValue);
                }}
              >
                <ImageComponent
                  style={styles.skillAddImage}
                  source={addGreen}
                ></ImageComponent>
              </TouchableOpacity>
            ) : (
              <View></View>
            )}

            <View style={styles.skillCont}>
              <Input
                inputStyle={styles.input}
                // onSubmitEditing={onAddSkill}
                placeholder={strings.addSkill}
                value={skillValue}
                onChangeText={setSkillValue}
                placeholderTextColor="#818181"
                children
              />
            </View>
          </>
        ) : null}

        <View style={styles.row}>
          <FlatListComponent
            data={allSkills}
            keyExtractor={(item) => item.toString()}
            renderItem={renderItem}
            numColumns={100}
            showsHorizontalScrollIndicator={false}
            columnWrapperStyle={styles.flexWrap}
          />
        </View>

        {/* <View>
          <Modal transparent={false} animationType="slide" visible={openQues}>
            <View>
              <View
                style={
                  Platform.OS === "ios"
                    ? styles.HeaderContainerIOS
                    : styles.HeaderContainerAdroid
                }
              >
                <TouchableOpacity
                  onPress={() => {
                    updateAnsBack();
                  }}
                >
                  <View style={styles.dropDownView}>
                    <ImageComponent
                      source={downImg}
                      style={styles.downIcon}
                    ></ImageComponent>
                  </View>
                </TouchableOpacity>
                <Text style={styles.MainContainer}>
                  {strings.updateQuestion}
                </Text>
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => {
                    quesAnsModalHide();
                  }}
                >
                  <Text style={styles.saveContainer}>{strings.save}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.listContainer}>
                {ansQueDataTwo ? (
                  <FlatList
                    data={ansQueDataTwo}
                    renderItem={({ item, index }) => (
                      <View
                        style={{
                          borderBottomWidth: 1,
                          marginBottom: 12,
                          borderBottomColor: "gray",
                        }}
                      >
                        <Text style={styles.questionsLbl}>{item.question}</Text>
                        <View style={{ height: 110 }}>
                          <TextInput
                            editable={true}
                            value={item.answer}
                            placeholder="Add your answer here..."
                            placeholderTextColor="#8B8888"
                            multiline={true}
                            style={styles.inputCont}
                            // onChangeText={value => { myFunction() }}
                            onChangeText={(text) =>
                              handleToggleYourList(text, index)
                            }
                          ></TextInput>
                        </View>
                      </View>
                    )}
                  ></FlatList>
                ) : (
                  <View></View>
                )}
                <View style={{ height: 50 }}></View>
              </View>
            </View>
          </Modal>

          <View>
            <TouchableOpacity
              onPress={() => {
                quesAnsModalOpen();
              }}
            >
              <Text style={styles.ProfileUpdateCont}>
                {strings.queAnsTitle}
              </Text>
            </TouchableOpacity>
            <View style={{ marginBottom: 30 }}>
              <FlatList
                data={ansQueData}
                renderItem={({ item }) => (
                  <View>
                    {item.answer != "" ? (
                      <View>
                        <Text style={styles.questionsDisplayLbl}>
                          {item.question}
                        </Text>
                        <Text style={styles.answerDisplayCont}>
                          {item.answer}
                        </Text>
                      </View>
                    ) : (
                      <View></View>
                    )}
                  </View>
                )}
              ></FlatList>
            </View>
          </View>
        </View> */}
      </View>
    </>
  );
};
