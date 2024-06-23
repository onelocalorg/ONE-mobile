import ReadMore from "@fawazahmed/react-native-read-more";
import _ from "lodash/fp";
import React from "react";
import { Image, Pressable, Text, TouchableOpacity, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useNavigations } from "~/app-hooks/useNavigations";
import {
  pin,
  postCalender,
  greenImage as threeVerticalDots,
} from "~/assets/images";
import { ImageComponent } from "~/components/image-component";
import { Post, PostType } from "~/types/post";
import { createStyleSheet } from "./style";

export enum PostCardSize {
  Small,
  Medium,
}

interface PostCardProps {
  post: Post;
  size?: PostCardSize;
  onSeeMore?: () => void;
}
export const PostCard = ({ post, size, onSeeMore }: PostCardProps) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const { showPostContextMenu, gotoPostDetails, gotoUserProfile } =
    useNavigations();

  const numberOfLines =
    size === PostCardSize.Small
      ? 4
      : size === PostCardSize.Medium
      ? 7
      : undefined;

  return (
    <View>
      <Pressable onPress={gotoPostDetails(post)}>
        <Text style={styles.posttitle}>{_.capitalize(post?.type)}</Text>
        <Pressable
          onPress={showPostContextMenu(post, post.author.id)}
          style={{
            position: "absolute",
            right: 14,
            top: 10,
            zIndex: 111122,
          }}
        >
          <ImageComponent
            resizeMode="cover"
            style={styles.postfilterImage}
            source={threeVerticalDots}
          ></ImageComponent>
        </Pressable>
        <View style={styles.userDetailcont}>
          <TouchableOpacity onPress={gotoUserProfile(post.author)}>
            <ImageComponent
              resizeMode="cover"
              style={styles.postProfile}
              source={{ uri: post.author.pic }}
            ></ImageComponent>
          </TouchableOpacity>
          <View>
            <Text numberOfLines={1} style={styles.userName}>
              {post.author.firstName} {post.author.lastName}
            </Text>
            {post.postDate ? (
              <Text style={styles.postTime}>
                {post.postDate.toLocaleString()}
              </Text>
            ) : null}
          </View>
        </View>
        <ReadMore
          numberOfLines={numberOfLines}
          style={styles.postDes}
          onSeeMore={onSeeMore}
        >
          {post.details}
        </ReadMore>
        {post.images.map((image) => (
          <ImageComponent
            key={image.key}
            resizeMode="cover"
            source={{ uri: image.url }}
            style={styles.userPost}
          ></ImageComponent>
        ))}
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
        {post.type !== PostType.GRATIS && post.address ? (
          <View style={styles.postDetailCont}>
            <Text style={styles.postDetailTitle}>Where:</Text>
            <Image source={pin} style={styles.detailImage}></Image>
            <Text style={styles.postDetail}>{post.address}</Text>
          </View>
        ) : (
          <></>
        )}

        {post.startDate ? (
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
