import { useMutation } from "@tanstack/react-query";
import _ from "lodash/fp";
import React, { useContext } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { ButtonComponent } from "~/components/button-component";
import { SizedBox } from "~/components/sized-box";
import { AuthDispatchContext } from "~/navigation/AuthContext";
import { AuthMutations } from "~/network/api/services/useAuthService";
import { normalScale, verticalScale } from "~/theme/device/normalize";
import { CurrentUser } from "~/types/current-user";
import { NewUser } from "~/types/new-user";
import { isNotEmpty } from "~/utils/common";

export const SignUpScreen = () => {
  const { strings } = useStringsAndLabels();
  const { handleSignUp, handleSignInUnverified } =
    useContext(AuthDispatchContext);

  const EMAIL_REGEX =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g;
  const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  const { mutate: signUp, isPending } = useMutation<
    CurrentUser,
    Error,
    NewUser
  >({
    mutationKey: [AuthMutations.signUp],
  });

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<NewUser>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSignUp = (data: NewUser) => {
    signUp(_.pickBy(isNotEmpty, data) as unknown as NewUser, {
      onSuccess: (user) => {
        handleSignUp(user);
        Alert.alert(
          "Registration success!",
          "Please check your email to verify your account.",
          [
            {
              text: "OK",
              onPress: () =>
                handleSignInUnverified({
                  email: getValues("email"),
                  password: getValues("password"),
                }),
            },
          ]
        );
      },
    });
  };

  const keyboardDismiss = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableOpacity activeOpacity={1} onPress={keyboardDismiss}>
      <SizedBox height={verticalScale(22)} />
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollView}
      >
        <View style={styles.container}>
          <Text style={styles.texClass}>{strings.email}</Text>
          <Controller
            control={control}
            rules={{
              required: true,
              pattern: EMAIL_REGEX,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholderTextColor="#8B8888"
                style={styles.textInput}
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect={false}
                inputMode="email"
                keyboardType="email-address"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
              />
            )}
            name="email"
          />
          {errors.email && (
            <Text>
              {errors.email.type === "required"
                ? "This is required."
                : "Must be an email"}
            </Text>
          )}

          <SizedBox height={verticalScale(10)} />
          <Text style={styles.texClass}>{strings.password}</Text>
          <Controller
            control={control}
            rules={{
              required: true,
              minLength: 8,
              pattern: PASSWORD_REGEX,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                secureTextEntry
                placeholderTextColor="#8B8888"
                style={styles.textInput}
                autoCapitalize="none"
                autoComplete="new-password"
                inputMode="text"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
              />
            )}
            name="password"
          />
          {errors.password && (
            <Text>
              {errors.password.type === "required"
                ? "This is required."
                : errors.password.type === "minLength"
                ? "Must be at least 8 characters"
                : "Must contain at least one letter and one number"}
            </Text>
          )}

          <SizedBox height={verticalScale(10)} />
          <Text style={styles.texClass}>{strings.confirmPassword}</Text>
          <Controller
            control={control}
            rules={{
              required: true,
              validate: (value, formValues) => value === formValues.password,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                secureTextEntry
                placeholderTextColor="#8B8888"
                style={styles.textInput}
                autoCapitalize="none"
                autoComplete="new-password"
                inputMode="text"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
              />
            )}
            name="confirmPassword"
          />
          {errors.confirmPassword && <Text>Must match password</Text>}
          <SizedBox height={verticalScale(10)} />
          <Text style={styles.texClass}>{strings.firstName}</Text>
          <Controller
            control={control}
            rules={{
              required: true,
              minLength: 2,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholderTextColor="#8B8888"
                style={styles.textInput}
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
              />
            )}
            name="firstName"
          />
          {errors.firstName && <Text>This is required</Text>}

          <SizedBox height={verticalScale(14)} />
          <Text style={styles.texClass}>{strings.lastName}</Text>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholderTextColor="#8B8888"
                style={styles.textInput}
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
              />
            )}
            name="lastName"
          />
          <SizedBox height={verticalScale(14)} />

          <ButtonComponent
            style={styles.signUpBtn}
            onPress={handleSubmit(onSignUp)}
            title={strings.signUpTwo}
            disabled={isPending}
          />
        </View>
      </KeyboardAwareScrollView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  loginLogo: {
    height: normalScale(85),
    width: normalScale(85),
    alignSelf: "center",
  },
  localText: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "400",
    color: "white",
  },
  texClass: {
    fontSize: 15,
    fontFamily: "NotoSerif-Regular",
    color: "black",
    fontWeight: "600",
  },
  container: {
    paddingHorizontal: normalScale(50),
  },
  tncStyle: {
    flexDirection: "row",
    alignItems: "center",
  },
  radio: {
    height: normalScale(18),
    width: normalScale(18),
    marginRight: normalScale(15),
  },
  agreeText: {
    fontSize: 14,
    fontFamily: "NotoSerif-Regular",
    color: "black",
  },
  bold: {
    fontFamily: "bold",
  },
  forgot: {
    fontSize: 14,
    fontFamily: "NotoSerif-Regular",
    color: "black",
    alignSelf: "center",
  },
  googleButton: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "black",
    paddingHorizontal: normalScale(14),
    paddingVertical: verticalScale(15),
    alignItems: "center",
    flexDirection: "row",
  },
  google: {
    height: normalScale(24),
    width: normalScale(24),
  },
  loginGoogle: {
    fontSize: 14,
    fontFamily: "NotoSerif-Regular",
    color: "black",
    marginLeft: normalScale(18),
  },
  signUpBtn: {
    backgroundColor: "#684F85",
    borderRadius: 14,
    paddingVertical: verticalScale(14),
    shadowColor: "black",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: verticalScale(0),
    },
    elevation: 5,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: normalScale(16),
    marginTop: 15,
  },
  textInput: {
    backgroundColor: "white",
    borderRadius: 8,
    fontSize: 14,
    borderColor: "#8B8888",
    borderWidth: 1,
    paddingVertical: normalScale(4),
    paddingHorizontal: normalScale(10),
    // fontFamily: theme.fontType.medium,
    lineHeight: 20,
    color: "black",
  },
  HeaderContainerTwo: {
    backgroundColor: "#003333",
    height: 150,
    // position: 'relative',
  },
  row2: {
    position: "absolute",
    top: 52,
    left: 10,
    height: normalScale(30),
    width: normalScale(30),
    zIndex: 11111222222,
    paddingLeft: 4,
    paddingTop: 4,
  },
  arrowLeft: {
    height: normalScale(22),
    width: normalScale(22),
  },
  searchContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    height: 35,
    width: 100,
    borderRadius: 10,
    flexDirection: "row",
    marginLeft: 8,
    position: "absolute",
    bottom: 20,
    color: "#FFFFFF",
  },
  searchInput: {
    flexShrink: 1,
    marginLeft: 7,
    marginRight: 5,
    height: 35,
    width: 120,
    color: "#FFFFFF",
  },
  searchIcon: {
    height: 15,
    width: 15,
    marginTop: 10,
    marginLeft: 5,
  },
  oneContainer: {
    flexDirection: "row",
    justifyContent: "center",
    position: "relative",
    top: 50,
  },
  oneContainerImage: {
    height: 60,
    width: 60,
    marginTop: 10,
    marginLeft: 5,
  },
  oneContainerText: {
    textAlign: "center",
    fontSize: 60,
    fontFamily: "NotoSerif-Regular",
    fontWeight: "400",
    color: "#FFFFFF",
    marginLeft: 2,
    marginBottom: -10,
  },
  temsCont: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(17, 56, 98, 0.83)",
  },
  boldtnc: {
    fontFamily: "NotoSerif-Bold",
    color: "rgba(17, 56, 98, 0.83)",
    fontWeight: "600",
  },
  scrollView: {
    paddingBottom: verticalScale(200),
  },
  profilePicClass: {
    alignSelf: "center",
    height: 80,
    width: 80,
    margin: 20,
  },
  profilePicClassTwo: {
    alignSelf: "center",
    height: 125,
    width: 125,
    borderRadius: 100,
  },
  backgroundPicClass: {
    alignSelf: "center",
    height: 100,
    width: 100,
  },
  backgroundPicClassTwo: {
    alignSelf: "center",
    height: normalScale(120),
    width: "100%",
    borderRadius: 14,
  },
  profileBackground: {
    borderColor: "black",
    borderRadius: 14,
    padding: 10,
    borderWidth: 4,
    marginTop: 10,
  },
  profileUser: {
    borderColor: "black",
    borderRadius: 100,
    padding: 10,
    height: 150,
    width: 150,
    alignSelf: "center",
    borderWidth: 4,
    marginTop: 10,
  },
  gesture: {
    flex: 1,
  },
  keyboardViewTwo: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    // top:0
  },
  containerGallery: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
  },
  imageActionSheet: {
    position: "absolute",
    // top: 310,
    bottom: 0,
    left: 0,
    right: 0,
    height: "auto",
    // backgroundColor: theme.colors.modalOverlay,
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    paddingVertical: verticalScale(20),
    maxHeight: verticalScale(600),
    borderColor: "#A493B7",
    backgroundColor: "rgba(255, 255, 255, 0.88)",
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderRightWidth: 3,
    flex: 1,
    marginHorizontal: 10,
  },
  galleryText: {
    textAlign: "center",
    fontSize: 18,
    fontFamily: "NotoSerif-Medium",
    backgroundColor: "#A493B7",
    color: "white",
    padding: 10,
    margin: 10,
  },
  cameraText: {
    textAlign: "center",
    fontSize: 18,
    fontFamily: "NotoSerif-Medium",
    backgroundColor: "#A493B7",
    color: "white",
    padding: 10,
    margin: 10,
  },
  postInputTwo: {
    // backgroundColor: 'white',
    // borderRadius: 10,
    // width: width - 200,
    // marginLeft: 10,
    // paddingHorizontal: 10,
    // height:35,
    // justifyContent:'center'

    backgroundColor: "white",
    borderRadius: 8,
    fontSize: 16,
    borderColor: "#8B8888",
    borderWidth: 1,
    padding: normalScale(10),
    fontFamily: "NotoSerif-Regular",
    height: verticalScale(38),
    color: "black",
  },
  time: {
    fontFamily: "NotoSerif-Light",
    fontSize: 12,
    color: "black",
  },
});
