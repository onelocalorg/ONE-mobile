import { useQuery } from "@tanstack/react-query";
import { FlatList, ImageComponent, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { buttonArrowGreen } from "~/assets/images";
import { useUserService } from "~/network/api/services/useUserService";
import { createStyleSheet } from "./style";

export const UserChooser = ({userList} = { userList: String[]}) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);

  const {
    queries: {
      list: getUsers,
    },
  } = useUserService();
  const {
    isPending,
    isError,
    data: userList,
    error,
  } = useQuery(getUsers());


  const AddUserList = (item: any) => {
    const found = userList?.find((element: any) => element.id == item.id);
    if (userList.length < 1) {
      if (!found) {
        recentlyJoinUser([...userList, item]);
        const newItems = { ...item };
        delete newItems.gratisNo;
        const newuserData = {
          ...newItems,
          first_name: item.first_name,
          last_name: item.last_name,
          pic: item.pic,
          id: item.id,
        };
        SetuserData(newuserData);
        getUsetList([newuserData]);
        setNewUserIdData(newuserData.id);
      } else {
        Toast.show("Already Added", Toast.LONG, {
          backgroundColor: "black",
        });
      }
      onUserSearch("");
    } else {
      Toast.show("You can not select more than one users", Toast.LONG, {
        backgroundColor: "black",
      });
    }
  };

  const removeuserSelect = (id: any) => {
    const newPeople = userList.filter((person: any) => person !== id);
    recentlyJoinUser(newPeople);
  };

  async function gratisUserList(textUser: any) {
    const token = await AsyncStorage.getItem("token");
    const datas: any = {
      searchtext: textUser,
    };
    onUserSearch(textUser);
    LodingData(true);
    console.log(
      process.env.API_URL + "/v3/users/search-user?searchtext=" + textUser
    );
    try {
      const response = await fetch(
        process.env.API_URL + "/v3/users/search-user?searchtext=" + textUser,
        {
          method: "get",
          headers: new Headers({
            Authorization: "Bearer " + token,
            "Content-Type": "application/x-www-form-urlencoded",
          }),
        }
      );
      const dataItem = await response.json();
      const result = dataItem?.data?.map((item: any) => {
        return { ...item };
      });
      userGratiesListData(result);
      console.log(dataItem);
      LodingData(false);
    } catch (error) {
      LodingData(false);
      console.error(error);
    }
  }


    return (<>
<View style={styles.avatarContainer}>
<ScrollView
  horizontal={true}
  showsHorizontalScrollIndicator={false}
>
  {userList.map((userList: any) => {
    return (
      <TouchableOpacity
        onPress={() => removeuserSelect(userList)}
      >
        <ImageComponent
          style={styles.avatarImage}
          isUrl={!!userList?.pic}
          resizeMode="cover"
          uri={userList?.pic}
        ></ImageComponent>
      </TouchableOpacity>
    );
  })}
</ScrollView>
</View>

{usertext.length !== 0 ? (
<View
  style={{
    borderWidth: 1,
    marginVertical: 10,
    marginHorizontal: 10,
    marginRight: 20,
    borderRadius: 10,
    maxHeight: 275,
    overflow: "hidden",
    height: "auto",
  }}
>
  <ScrollView showsVerticalScrollIndicator={false}>
    <FlatList
      data={usergratisList}
      renderItem={({ item, index }) => (
        <TouchableOpacity
          activeOpacity={1}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 5,
            borderBottomWidth: 1,
            borderColor: "gray",
            paddingVertical: 8,
          }}
        >
          <View
            style={{ flexDirection: "row", marginRight: 50 }}
          >
            <ImageComponent
              style={{
                height: 30,
                width: 30,
                marginRight: 20,
                marginLeft: 10,
                borderRadius: 100,
              }}
              resizeMode="cover"
              source={{ uri: item?.pic }}
            ></ImageComponent>
            <Text
              numberOfLines={1}
              style={{
                alignSelf: "center",
                flexShrink: 1,
                width: 150,
                color: theme.colors.black,
              }}
            >
              {item?.first_name} {item?.last_name}
            </Text>

            <TouchableOpacity onPress={() => AddUserList(item)}>
              <ImageComponent
                style={{
                  height: 20,
                  width: 20,
                  marginLeft: 20,
                  marginTop: 2,
                }}
                source={buttonArrowGreen}
              ></ImageComponent>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )}
    ></FlatList>
  </ScrollView>
</View>
</>)}
