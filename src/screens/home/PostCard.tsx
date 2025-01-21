import _ from "lodash/fp";
import React, { useState } from "react";
import { Image, Pressable, Text, TouchableOpacity, View } from "react-native";
import Markdown, { MarkdownIt } from "react-native-markdown-display";
import Carousel from "react-native-reanimated-carousel";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useNavigations } from "~/app-hooks/useNavigations";
import {
  pin,
  postCalender,
  greenImage as threeVerticalDots,
} from "~/assets/images";
import { ImageComponent } from "~/components/image-component";
import { Box } from "~/components/ui/box";
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
  const [layoutWidth, setLayoutWidth] = useState<number>();
  const { showPostContextMenu, gotoPostDetails, gotoUserProfile } =
    useNavigations();

  const numberOfLines =
    size === PostCardSize.Small
      ? 4
      : size === PostCardSize.Medium
      ? 7
      : undefined;

  return (
    <View
      onLayout={(event) => {
        const { width } = event.nativeEvent.layout;
        setLayoutWidth(width);
      }}
    >
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
        {post.details && (
          <Box className="px-4">
            <Markdown
              markdownit={MarkdownIt({ typographer: true }).disable([
                "image",
                "heading",
                "html_block",
              ])}
            >
              {post.details.substring(0, 200)}
            </Markdown>
          </Box>
        )}
        {post.images.length > 1
          ? layoutWidth && (
              <Carousel
                loop
                width={layoutWidth}
                height={layoutWidth}
                autoPlay={true}
                data={post.images}
                scrollAnimationDuration={1000}
                renderItem={({ item: image }) => (
                  <ImageComponent
                    key={image.key}
                    resizeMode="cover"
                    source={{ uri: image.url }}
                    style={styles.userPost}
                  />
                )}
              />
            )
          : post.images.map((image) => (
              <ImageComponent
                key={image.key}
                resizeMode="cover"
                source={{ uri: image.url }}
                style={styles.userPost}
              />
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
