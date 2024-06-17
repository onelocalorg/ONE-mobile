import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { buttonArrowGreen } from "~/assets/images";
import { ImageComponent } from "~/components/image-component";
import { SizedBox } from "~/components/sized-box";
import { LOG } from "~/config";
import { OneUser } from "~/types/one-user";
import { createStyleSheet } from "./style";

interface UserListProps {
  onChangeList?: (keys: string[]) => void;
}
export const UserList = ({ onChangeList }: UserListProps) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);

  const [userList, setUserList] = useState<OneUser[]>([]);

  async function searchForUser(searchText: string) {
    LOG.debug("> searchForUser", searchText);

    const token = await AsyncStorage.getItem("token");
    try {
      const response = await fetch(
        process.env.API_URL + "/v3/users/search-user?searchtext=" + searchText,
        {
          method: "get",
          headers: new Headers({
            Authorization: "Bearer " + token,
            "Content-Type": "application/x-www-form-urlencoded",
          }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        LOG.debug("< searchForUser", data);

        setUserList(data?.data);
      }
    } catch (error) {
      LOG.error("searchForUser", error);
    }
  }

  const addUserList = (item: any) => {
    const found = userList.find((element: any) => element.id == item.id);
    if (!found) {
      setUserList([...userList, item]);

      const newItems = { ...item };
      delete newItems.first_name;
      delete newItems.last_name;
      delete newItems.pic;
      delete newItems.id;
      delete newItems.gratisNo;
      console.log(item.gratisNo);
      const newuserData = {
        ...newItems,
        point: item.gratisNo,
        user_id: item.id,
      };
      setuserListArray([...userListArray, newuserData]);

      console.log(userListArray);
    } else {
      Toast.show("Already Added", Toast.LONG, {
        backgroundColor: "black",
      });
    }
  };

  function handleToggleYourList(item: any, jindex: any, point: any) {
    let newArr = userList.map((item: any, index: any) => {
      const target: Partial<typeof item> = { ...item };
      delete target["first_name"];
      delete target["last_name"];

      if (index == jindex) {
        return { ...target, point: point };
      } else {
        return target;
      }
    });
    setUserList(newArr);
    console.log("===========ansQueData 22==========", newArr);
  }

  const removeuserSelect = (id: any) => {
    const newPeople = userList.filter((person: any) => person !== id);
    console.log("--------newPeople---------", newPeople);

    setUserList(_.filter((person) => person !== id));
  };

  return (
    <>
      <View style={styles.createPostCont}>
        <Text style={styles.textOne}>To:</Text>

        <TextInput
          placeholder="who do you want to send gratis to?"
          placeholderTextColor="darkgray"
          value={usertext}
          onChangeText={(text) => searchForUser(text)}
          style={styles.postInputToType}
        ></TextInput>

        <TouchableOpacity activeOpacity={1}>
          <ImageComponent
            resizeMode="stretch"
            source={{ uri: typeIconTo }}
            style={styles.createImgOne}
          ></ImageComponent>
        </TouchableOpacity>
      </View>
      <SizedBox height={styles.verticalScale(10)}></SizedBox>
      <View style={styles.avatarContainer}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {userList.map((userList: any) => {
            return (
              <TouchableOpacity onPress={() => removeuserSelect(userList)}>
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

      <TouchableOpacity onPress={() => addUserList(item)}>
        <ImageComponent
          style={{
            height: 20,
            width: 20,
          }}
          source={buttonArrowGreen}
        ></ImageComponent>
      </TouchableOpacity>
    </>
  );
};
