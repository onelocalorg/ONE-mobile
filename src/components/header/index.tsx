import {
  Search,
  activeRadio,
  arrowLeft,
  bell,
  hamburger,
  headerBg,
  headerTitle,
  loginLogo,
  onelogo,
  pin,
  postImage,
} from "@assets/images";
import React, { useState } from "react";
import {
  ImageBackground,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { createStyleSheet } from "./style";
import { useAppTheme } from "@app-hooks/use-app-theme";
import { ImageComponent } from "@components/image-component";
import { launchCamera } from "react-native-image-picker";
import {
  UserProfileState,
  onSetCoverImage,
} from "@network/reducers/user-profile-reducer";
import { useDispatch, useSelector } from "react-redux";
import { StoreType } from "@network/reducers/store";
import { useStringsAndLabels } from "@app-hooks/use-strings-and-labels";
import { Searchbar } from "react-native-paper";
import { height } from "@theme/device/device";

interface HeaderProps {
  title?: string;
  hasBackButton?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
  onBackPress?: () => void;
  fromProfile?: boolean;
  fromLogin?: boolean;
  fromEvent?: boolean;
  fromEventDetail?: boolean;
}

export const Header = (props: HeaderProps) => {
  const {
    title,
    leftIcon,
    rightIcon,
    children,
    onBackPress,
    hasBackButton = false,
    fromProfile = false,
    fromLogin = false,
    fromEvent = false,
    fromEventDetail = false,
  } = props || {};
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const { user } = useSelector<StoreType, UserProfileState>(
    (state) => state.userProfileReducer
  ) as { user: { coverImage: string } };
  const dispatch = useDispatch();
  const { strings } = useStringsAndLabels();

  const state = {
    search: "",
  };

  const renderBackButton = () => {
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={onBackPress}>
        <ImageComponent source={arrowLeft} style={styles.arrowLeft} />
      </TouchableOpacity>
    );
  };

  const [searchQuery, setSearchQuery] = useState("");

  // const onChangeSearch = query => setSearchQuery(query);

  // <TouchableOpacity
  //   disabled={!fromProfile}
  //   activeOpacity={1}
  //   onPress={onUploadImage}
  //   style={styles.container}>
  //   <ImageBackground
  //     resizeMode="cover"
  //     source={user?.coverImage ? { uri: user?.coverImage } : headerBg}
  //     style={styles.imageContainer}>
  //     <View style={styles.row}>
  //       <View>{leftIcon || (hasBackButton && renderBackButton())}</View>
  //       <ImageComponent source={headerTitle} style={styles.image} />
  //       {!!title && <Text>{title}</Text>}
  //       <View>{rightIcon}</View>
  //       {children}
  //     </View>
  //   </ImageBackground>
  // </TouchableOpacity>

  return !fromProfile && !fromLogin && !fromEvent && !fromEventDetail ? (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={1}
      disabled={!fromProfile}
    >
      <View style={styles.arrowClass}>
        {leftIcon || (hasBackButton && renderBackButton())}
      </View>
      <View style={styles.searchContainer}>
        <ImageComponent
          style={styles.searchIcon}
          source={Search}
        ></ImageComponent>
        <TextInput
          value={searchQuery}
          placeholderTextColor="#FFFF"
          placeholder="Search"
          style={styles.searchInput}
          onChangeText={(value) => {
            setSearchQuery(value);
          }}
        ></TextInput>
      </View>

      <View style={styles.oneContainer}>
        <ImageComponent
          style={styles.oneContainerImage}
          source={onelogo}
        ></ImageComponent>
        <Text style={styles.oneContainerText}>NE</Text>
      </View>

      {rightIcon ? (
        <View style={{ position: "absolute", right: 10, top: 40 }}>
          <Text
            style={{
              fontSize: 16,
              color: theme.colors.white,
              fontWeight: "500",
            }}
          >
            {rightIcon}
          </Text>
        </View>
      ) : (
        <View>
          <Text></Text>
        </View>
      )}
      <View style={styles.profileContainer}>
        {/* {children ? <ImageComponent style={styles.bellIcon} source={bell}></ImageComponent> : <View></View>} */}
        <TouchableOpacity>
          <View style={styles.profile}>{children}</View>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  ) : (
    <TouchableOpacity
      disabled={!fromProfile}
      activeOpacity={1}
      // onPress={onUploadImage}
      style={styles.container}
    >
      <ImageBackground
        resizeMode="cover"
        source={user?.coverImage ? { uri: user?.coverImage } : headerBg}
        style={styles.imageContainer}
      >
        <View style={styles.row}>
          <View>{leftIcon || (hasBackButton && renderBackButton())}</View>
          <ImageComponent source={headerTitle} style={styles.image} />
          {!!title && <Text>{title}</Text>}
          <View>{rightIcon}</View>
        </View>
        {children}
      </ImageBackground>
    </TouchableOpacity>
  );
};
