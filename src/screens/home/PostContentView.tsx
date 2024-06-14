import _ from "lodash/fp";
import React from "react";
import {
  Image,
  Platform,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { greenImage, pin, postCalender } from "~/assets/images";
import { ImageComponent } from "~/components/image-component";
import { OneUser } from "~/types/one-user";
import { Post } from "~/types/post";
import { createStyleSheet } from "./style";

type PostContentViewProps = {
  post: Post;
  onPress?: () => void;
  onAvatarPress?: (author: OneUser) => void;
};
export const PostContentView = ({
  post,
  onPress,
  onAvatarPress,
}: PostContentViewProps) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);

  return (
    <View>
      <Pressable onPress={onPress}>
        <Text style={styles.posttitle}>{_.capitalize(post?.type)}</Text>
        <TouchableOpacity
          style={{
            position: "absolute",
            right: 14,
            top: 10,
            zIndex: 111122,
          }}
        >
          <TouchableOpacity>
            <ImageComponent
              resizeMode="cover"
              style={styles.postfilterImage}
              source={greenImage}
            ></ImageComponent>
          </TouchableOpacity>
        </TouchableOpacity>
        <View style={styles.userDetailcont}>
          <TouchableOpacity onPress={() => onAvatarPress?.(post.author)}>
            <ImageComponent
              resizeMode="cover"
              style={styles.postProfile}
              source={{ uri: post.author.pic }}
            ></ImageComponent>
          </TouchableOpacity>
          <View>
            <Text numberOfLines={1} style={styles.userName}>
              {post.author.first_name} {post.author.last_name}
            </Text>
            {post.postDate ? (
              <Text style={styles.postTime}>
                {post.postDate.toLocaleString()}
              </Text>
            ) : null}
          </View>
        </View>
        <View
          style={
            Platform.OS === "ios"
              ? styles.userListDisplayCont
              : styles.userListDisplayContTwo
          }
        >
          {/* <TouchableOpacity
          onPress={() =>
            recentUserProfilePress(post?.to?.users[0]?.user_id["id"])
          }
        >
          <ImageComponent
            resizeMode="cover"
            style={styles.userListDisplay}
            source={{
              uri: post?.to?.users[0]?.user_id["pic"],
            }}
          ></ImageComponent>
        </TouchableOpacity> */}
          {/* <TouchableOpacity
          onPress={() =>
            recentUserProfilePress(post?.to?.users[1]?.user_id["id"])
          }
        >
          <ImageComponent
            resizeMode="cover"
            style={styles.userListDisplay}
            source={{ uri: post?.to?.users[1]?.user_id["pic"] }}
          ></ImageComponent>
        </TouchableOpacity> */}
        </View>
        <Text style={styles.postDes}>{post.details}</Text>
        {post.event_image ? (
          <ImageComponent
            resizeMode="cover"
            source={{ uri: post.event_image }}
            style={styles.userPost}
          ></ImageComponent>
        ) : null}
        <View style={styles.postDetailCont}>
          <Text style={styles.postDetailTitle}>What:</Text>
          {/* <ImageComponent
          source={{ uri: post?.what?.icon }}
          style={styles.detailImage}
        ></ImageComponent> */}
          <Text style={styles.postDetail}>{post.name}</Text>
        </View>
        {/* {post?.type !== "Gratis" && post?.for?.name ? (
        <View style={styles.postDetailCont}>
          <Text style={styles.postDetailTitle}>For:</Text>
          <Image
            source={{ uri: post?.for?.icon }}
            style={styles.detailImage}
          ></Image>
          <Text style={styles.postDetail}>{post?.for?.name}</Text>
        </View>
      ) : (
        <></>
      )} */}
        {post?.type !== "Gratis" && post.address ? (
          <View style={styles.postDetailCont}>
            <Text style={styles.postDetailTitle}>Where:</Text>
            <Image source={pin} style={styles.detailImage}></Image>
            <Text style={styles.postDetail}>{post.address}</Text>
          </View>
        ) : (
          <></>
        )}

        {post?.startDate ? (
          <View style={styles.postDetailCont}>
            <Text style={styles.postDetailTitle}>When:</Text>
            <Image source={postCalender} style={styles.detailImage}></Image>
            <Text style={styles.postDetail}>
              {post.startDate.toLocaleString()}
            </Text>
          </View>
        ) : null}
      </Pressable>
    </View>
  );
};
