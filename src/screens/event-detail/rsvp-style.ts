import { StyleSheet } from "react-native";
import { ThemeProps } from "~/theme/theme";

export const createStyleSheet = (theme: ThemeProps) => {
  return StyleSheet.create({
    container2: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row",
      width: 300,
      height: 50,
      marginTop: 20,
      backgroundColor: "#DA9791",
      alignSelf: "center",
      borderRadius: 20,
      gap: 30,
    },
    button: {
      backgroundColor: "#E9B9B4",
      width: 65,
      height: 30,
      marginVertical: 10,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonText: {
      color: "white",
      fontSize: 12,
      textAlign: "center",
      fontWeight: "400",
      fontFamily: "NotoSerif-Regular",
    },
    selectedButton: {
      borderColor: "green",
      borderWidth: 2,
    },
    rsvpContainer: {
      flexDirection: "row",
      alignItems: "flex-end",
    },
    profilePicContainer: {
      marginRight: 10,
    },
    profilePic: {
      width: 50,
      height: 50,
      borderRadius: 50,
    },
    rsvpImageContainer: {
      position: "absolute",
      bottom: 0,
      right: 0,
    },
    rsvpImage: {
      width: 25,
      height: 25,
      borderRadius: 50,
    },
  });
};
