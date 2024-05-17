import {
  NavigationContainerRef,
  ParamListBase,
} from "@react-navigation/native";
import { DateTime } from "luxon";
import React, { useRef, useState } from "react";
import {
  Keyboard,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-simple-toast";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { DatePickerRefProps } from "~/components/date-range-picker";
import { createPost } from "~/network/api/services/post-service";
import { PostData } from "~/types/post-data";
import { PostView } from "./PostView";
import { createStyleSheet } from "./style";

interface CreatePostRequestScreenProps {
  navigation?: NavigationContainerRef<ParamListBase>;
}

export const CreatePostRequestScreen = (
  props: CreatePostRequestScreenProps
) => {
  const { navigation } = props || {};
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const { strings } = useStringsAndLabels();
  const [selecttype, createPostSelectType] = useState(1);
  const [type, createPostType] = useState("offer");
  const [typeIconWhat, getTypeIconWhat]: any = useState();
  const [showWhatPopover, setWhatShowPopover] = useState(false);
  const [getResourceList, getResourseData]: any = useState([]);
  const [whatSelectType, getWhatTypeValue]: any = useState();
  const [getResourcewhatList, getResourseDatawhat]: any = useState([]);
  const [getResourcefromList, getResourseDataFrom]: any = useState([]);
  const [getResourceToList, getResourseDataTo]: any = useState([]);
  const [getResourceForLis, getResourseDataFor]: any = useState([]);
  const [icontotype, getTypeIconTo]: any = useState();
  const [valueTotype, getToTypeValue] = useState("");
  const [iconFrom, setIconFrom]: any = useState();
  const [typeFrom, setTypeFrom]: any = useState();
  const [titleFrom, setTitleFrom]: any = useState();
  const [imageArray, setImageArray]: any = useState([]);
  const [imageArrayKey, setImageArrayKey]: any = useState([]);
  const [forName, createPostforName] = useState("");
  var [forQuantity, createPostforQuantity] = useState(1);
  const [whereAddress, createPostwhereAddress] = useState("");
  const [imageKey, selectedImageKey] = useState();
  const [when, setWhen] = useState<DateTime>();
  const [content, createPostcontent] = useState("");
  const [tags, createPosttags]: any = useState("");
  const [tagArray, tagselectArray]: any = useState([]);
  const [whatName, createPostwhatName] = useState("");
  const [fromName, setFromName] = useState("");
  const [addnewCmt, onAddComment] = useState("");
  const [addnewCmtReply, onAddCommentReply] = useState("");
  var [whatQuantity, createPostwhatQuantity] = useState(1);
  const [typeIconFor, getTypeIconFor]: any = useState();
  const [whatForType, getForTypeValue]: any = useState();
  const [showForPopover, setForShowPopover] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [showFromPopover, setFronShowPopover] = useState(false);
  var [location, setUserLocation]: any = useState();
  var [gratisNo, totalGratisData]: any = useState(1);
  const [userListArray, setuserListArray]: any = useState([]);
  const [usergratisList, userGratiesListData]: any = useState([]);
  const [usertext, onUserSearch] = useState("");
  const [settoTitle, setToTitleData]: any = useState();
  const datePickerRef: React.Ref<DatePickerRefProps> = useRef(null);

  const keyboardDismiss = () => {
    Keyboard.dismiss();
  };

  // useEffect(() => {
  //   LogBox.ignoreAllLogs();
  //   getResourcesAPI();
  // }, []);

  const CreateNewPostModal = async (data: PostData) => {
    if (whatName.length === 0) {
      Toast.show("Enter Title", Toast.LONG, {
        backgroundColor: "black",
      });
    } else if (content.length === 0) {
      Toast.show("Enter Body", Toast.LONG, {
        backgroundColor: "black",
      });
    } else {
      setLoading(true);
      const dataItem = await createPost(data);
      Toast.show(dataItem?.message, Toast.LONG, {
        backgroundColor: "black",
      });
      if (dataItem?.success === true) {
        navigation?.goBack();
      }

      setLoading(false);
    }
  };

  return (
    <>
      <ScrollView
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          onPress={keyboardDismiss}
          activeOpacity={1}
          style={styles.createPostModal}
        >
          <View>
            <View style={styles.postClass}>
              <Text style={styles.title}>Your Abundance</Text>
              <PostView
                type="request"
                onLoading={setLoading}
                onSubmit={CreateNewPostModal}
              />
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
};
