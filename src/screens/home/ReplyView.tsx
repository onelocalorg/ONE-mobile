import React from "react";
import { ImageComponent, Text, TouchableOpacity, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useNavigations } from "~/app-hooks/useNavigations";
import { Vector, gratisGreen } from "~/assets/images";
import { OneUser } from "~/types/one-user";
import { createStyleSheet } from "./style";

interface ReplyProps {
  postId: string;
  replyId: string;
  author: OneUser;
  content: string;
  // postDate: DateTime;
  gratis: number;
  onReplyPress?: (reply: string) => void;
}
export const ReplyView = ({
  postId,
  author,
  content,
  replyId,
  // postDate,
  gratis,
  onReplyPress,
}: ReplyProps) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);

  const { gotoUserProfile, showGiveGratisModal } = useNavigations();

  return (
    <>
      <View style={styles.replyImgProfile}>
        <TouchableOpacity activeOpacity={0.8} onPress={gotoUserProfile(author)}>
          <ImageComponent
            resizeMode="cover"
            style={styles.postProfile}
            source={{
              uri: author.pic,
            }}
          ></ImageComponent>
        </TouchableOpacity>
        <View style={styles.replyDisplayCont}>
          <Text style={{ fontSize: 12, color: "#110101" }}>
            {author.firstName} {author.lastName}
          </Text>
          <Text style={styles.replyMsgCont}>{content}</Text>
        </View>
      </View>

      <View style={styles.replyContainer}>
        <ImageComponent
          source={Vector}
          style={styles.vectorImg}
        ></ImageComponent>
        <TouchableOpacity onPress={() => onReplyPress?.(replyId)}>
          <Text style={styles.replyLbl}>reply</Text>
        </TouchableOpacity>

        {/* <Text style={styles.minuteCont}>{formatTimeFromNow(postDate)}</Text> */}
        <Text style={styles.minuteCont}>{gratis}</Text>
        <TouchableOpacity
          onPress={showGiveGratisModal({
            post: postId,
            replyId,
          })}
        >
          <ImageComponent
            resizeMode="cover"
            style={styles.replyImg}
            source={gratisGreen}
          ></ImageComponent>
        </TouchableOpacity>
      </View>
    </>
  );
};
