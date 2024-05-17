import { DateTime } from "luxon";
import React, { useRef, useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { buttonArrowGreen, pin, postCalender } from "~/assets/images";
import { ButtonComponent } from "~/components/button-component";
import {
  DatePickerRefProps,
  DateRangePicker,
} from "~/components/date-range-picker";
import { ImageComponent } from "~/components/image-component";
import { LocationAutocomplete } from "~/components/location-autocomplete/LocationAutocomplete";
import { SizedBox } from "~/components/sized-box";
import { verticalScale } from "~/theme/device/normalize";
import { PostData } from "~/types/post-data";
import { ImageUploader } from "./ImageUploader";
import { createStyleSheet } from "./style";

interface PostViewProps {
  type: string;
  validator?: (data: PostData) => boolean;
  onSubmit: (data: PostData) => void;
  onLoading?: (isLoading: boolean) => void;
}
interface Range {
  startDate: Date | undefined;
  endDate: Date | undefined;
}

export const PostView = ({
  type,
  onLoading,
  validator,
  onSubmit,
}: PostViewProps) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const { strings } = useStringsAndLabels();

  const [name, setName] = useState<string>();
  const [body, setBody] = useState<string>();
  const [date, setDate] = useState<DateTime>();
  const [address, setAddress] = useState<string>();
  const [location, setLocation] = useState();
  const [imageKeys, setImageKeys] = useState<string[]>([]);

  const datePickerRef: React.Ref<DatePickerRefProps> = useRef(null);

  const postData = () =>
    ({
      type,
      // what_type: whatSelectType,
      what_name: name,
      // what_quantity: whatQuantity,
      // for_type: whatForType,
      // for_name: forName ? forName : undefined,
      // for_quantity: forQuantity ? forQuantity : undefined,
      where_address: address,
      where_lat: undefined,
      where_lng: undefined,
      when: date?.toISO(),
      content: body,
      // tags: tagArray ? tagArray : undefined,
      post_image: imageKeys,
      // to_type: valueTotype,
      // to_offer_users: userListArray,
    } as PostData);

  return (
    <>
      <View>
        <View style={styles.createPostCont}>
          <TextInput
            placeholder="Title"
            placeholderTextColor="#8B8888"
            value={name}
            onChangeText={setName}
            style={styles.postInputTwo}
          ></TextInput>
          {/* <View style={styles.QuantityContainer}>
            <TouchableOpacity onPress={whatQtyMinus}>
              <Text style={styles.QuantityMinus}>-</Text>
            </TouchableOpacity>
            <Text style={styles.QuantityMunber}>
              {whatQuantity === 0 ? "∞" : whatQuantity}
            </Text>
            <TouchableOpacity onPress={whatQtyPlus}>
              <Text style={styles.QuantityPlus}>+</Text>
            </TouchableOpacity>
          </View> */}
          {/* <Popover
            isVisible={showWhatPopover}
            placement={PopoverPlacement.BOTTOM}
            onRequestClose={() => setWhatShowPopover(false)}
            from={
              <TouchableOpacity onPress={() => setWhatShowPopover(true)}>
                <ImageComponent
                  resizeMode="contain"
                  source={arrowDown}
                  style={styles.arrowDown}
                ></ImageComponent>
              </TouchableOpacity>
            }
          >
            <FlatList
              data={getResourcewhatList}
              renderItem={({ item }) => (
                <View style={{ width: 120 }}>
                  <TouchableOpacity
                    onPress={() =>
                      selectWhatTypePost(item?.icon, item?.value)
                    }
                    style={styles.container3}
                    activeOpacity={0.8}
                  >
                    <ImageComponent
                      source={{ uri: item?.icon }}
                      style={styles.icon1}
                    />
                    <Text style={styles.label2}>{item?.title}</Text>
                  </TouchableOpacity>
                  <View
                    style={{
                      height: 2,
                      backgroundColor: "lightgray",
                      marginHorizontal: 10,
                    }}
                  ></View>
                </View>
              )}
            ></FlatList>
          </Popover> */}
          {/* <TouchableOpacity
            activeOpacity={1}
            onPress={() => setWhatShowPopover(true)}
          >
            <ImageComponent
              resizeMode="cover"
              source={{ uri: typeIconWhat }}
              style={styles.createImgOne}
            ></ImageComponent>
          </TouchableOpacity> */}
        </View>

        {/* <SizedBox height={10}></SizedBox> */}

        <View style={styles.postCont}>
          {/* <Text style={styles.textOne}>Post Body</Text> */}
          <TextInput
            multiline
            placeholder="Body"
            placeholderTextColor="darkgray"
            textAlignVertical={"top"}
            value={body}
            onChangeText={setBody}
            style={styles.postInput}
          ></TextInput>
        </View>
        <SizedBox height={verticalScale(10)}></SizedBox>
        {/* <View style={styles.createPostCont}>
          <Text style={styles.textOne}>To</Text>

          <TextInput
            placeholderTextColor="darkgray"
            value={settoTitle}
            editable={settoTitle == "Everyone" ? false : true}
            onChangeText={(text) => {
              setToTitleData(text);
              gratisUserList(text);
            }}
            style={styles.postInputToType}
          ></TextInput>
          <Popover
            isVisible={showToPopover}
            placement={PopoverPlacement.BOTTOM}
            onRequestClose={() => setToShowPopover(false)}
            from={
              <TouchableOpacity onPress={() => setToShowPopover(true)}>
                <ImageComponent
                  resizeMode="contain"
                  source={arrowDown}
                  style={styles.arrowDown}
                ></ImageComponent>
              </TouchableOpacity>
            }
          >
            <FlatList
              data={getResourceToList}
              renderItem={({ item }) => (
                <View style={{ width: 120 }}>
                  <TouchableOpacity
                    onPress={() =>
                      selectToTypePost(
                        item?.icon,
                        item?.value,
                        item?.title
                      )
                    }
                    style={styles.container3}
                    activeOpacity={0.8}
                  >
                    <ImageComponent
                      source={{ uri: item?.icon }}
                      style={styles.icon1}
                    />
                    <Text style={styles.label2}>{item?.title}</Text>
                  </TouchableOpacity>
                </View>
              )}
            ></FlatList>
          </Popover> */}
        {/* <TouchableOpacity
            activeOpacity={1}
            onPress={() => setToShowPopover(true)}
          >
            <ImageComponent
              resizeMode="stretch"
              source={{ uri: icontotype }}
              style={styles.createImgOne}
            ></ImageComponent>
          </TouchableOpacity>
        </View>
        <SizedBox height={10}></SizedBox> */}

        {/* -----------------------Selected user list-------------- */}
        {/* <View style={styles.avatarContainer}>
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

        {settoTitle !== "Everyone" ? (
          <View
            style={{
              borderWidth: 1,
              marginVertical: 10,
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
                          width: 125,
                          color: theme.colors.black,
                        }}
                      >
                        {item?.first_name} {item?.last_name}
                      </Text>
                    </View>

                    <View style={styles.gratisCont}>
                      <TouchableOpacity onPress={() => AddUserList(item)}>
                        <ImageComponent
                          style={{
                            height: 20,
                            width: 20,
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
        ) : (
          <View></View>
        )} */}

        {/* <View style={styles.createPostCont}>
          <Text style={styles.textOne}>For</Text>
          <TextInput
            value={forName}
            placeholder="what reciprocity do you want?"
            placeholderTextColor="darkgray"
            onChangeText={(text) => createPostforName(text)}
            style={styles.postInputTwo}
          ></TextInput>
          <View style={styles.QuantityContainer}>
            <TouchableOpacity onPress={ForQtyMinus}>
              <Text style={styles.QuantityMinus}>-</Text>
            </TouchableOpacity>
            <Text style={styles.QuantityMunber}>{forQuantity}</Text>
            <TouchableOpacity onPress={ForQtyPlus}>
              <Text style={styles.QuantityPlus}>+</Text>
            </TouchableOpacity>
          </View>
          <Popover
            isVisible={showForPopover}
            placement={PopoverPlacement.BOTTOM}
            onRequestClose={() => setForShowPopover(false)}
            from={
              <TouchableOpacity onPress={() => setForShowPopover(true)}>
                <ImageComponent
                  resizeMode="contain"
                  source={arrowDown}
                  style={styles.arrowDown}
                ></ImageComponent>
              </TouchableOpacity>
            }
          >
            <FlatList
              data={getResourcewhatList}
              renderItem={({ item }) => (
                <View style={{ width: 120 }}>
                  <TouchableOpacity
                    onPress={() =>
                      selectForTypePost(item?.icon, item?.value)
                    }
                    style={styles.container3}
                    activeOpacity={0.8}
                  >
                    <ImageComponent
                      source={{ uri: item?.icon }}
                      style={styles.icon1}
                    />
                    <Text style={styles.label2}>{item?.title}</Text>
                  </TouchableOpacity>
                  <View
                    style={{
                      height: 2,
                      backgroundColor: "lightgray",
                      marginHorizontal: 10,
                    }}
                  ></View>
                </View>
              )}
            ></FlatList>
          </Popover>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setForShowPopover(true)}
          >
            <ImageComponent
              resizeMode="cover"
              source={{ uri: typeIconFor }}
              style={styles.createImgOne}
            ></ImageComponent>
          </TouchableOpacity>
        </View> */}

        <SizedBox height={10}></SizedBox>
        {/* <View> */}
        {/* <Text style={styles.textOne}>When</Text> */}

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => datePickerRef.current?.onOpenModal("start")}
          style={styles.postContainer}
        >
          <TextInput
            style={styles.postInputIconRight}
            placeholder="Date"
            editable={false}
            value={date?.toLocaleString(DateTime.DATETIME_MED)}
            dataDetectorTypes="calendarEvent"
          ></TextInput>

          <DateRangePicker
            selectStartDate={(d) => setDate(DateTime.fromJSDate(d))}
            ref={datePickerRef}
          />
          <ImageComponent
            resizeMode="cover"
            source={postCalender}
            style={styles.createImgTwo}
          ></ImageComponent>
        </TouchableOpacity>
        {/* </View> */}
        <SizedBox height={verticalScale(8)}></SizedBox>
        <View style={styles.createPostContTwo}>
          {/* <Text style={styles.textTwoWhere}>Where</Text> */}

          {/* <View style={styles.postInputTwo}> */}

          <LocationAutocomplete
            placeholder="Location"
            onPress={(data: any, details: any) => {
              setAddress(data.description);
              setLocation(details?.geometry?.location);
              console.log(data);
              console.log(details); // description
            }}
          />

          <ImageComponent
            resizeMode="cover"
            source={pin}
            style={styles.createImgTwo}
          ></ImageComponent>
        </View>

        {/* <View style={styles.tagCont}>
          <Text style={styles.textOne}>Tags</Text>
          <TextInput
            placeholder="add tags or people"
            placeholderTextColor="darkgray"
            value={tags}
            onChangeText={(text) => createPosttags(text)}
            style={styles.tagInput}
          ></TextInput>
        </View> */}

        {/* {tags !== "" ? (
          <TouchableOpacity
            style={{ zIndex: 1111111 }}
            onPress={() => {
              onAddSkill(tags);
            }}
          >
            <ImageComponent
              style={styles.skillAddImage}
              source={addGreen}
            ></ImageComponent>
          </TouchableOpacity>
        ) : (
          <View></View>
        )} */}

        {/* <View style={styles.row}>
                <FlatListComponent
                  data={tagArray}
                  keyExtractor={(item) => item.toString()}
                  renderItem={renderItem}
                  numColumns={100}
                  showsHorizontalScrollIndicator={false}
                  columnWrapperStyle={styles.flexWrap}
                />
              </View> */}

        <ImageUploader onLoading={onLoading} onChangeImages={setImageKeys} />
      </View>
      <View>
        {/* <View style={styles.quntitiyCont}>
          <Text style={styles.textOne}>Quantity</Text>
          <TextInput
            keyboardType="numeric"
            placeholder="how many?"
            value={whatQuantity}
            placeholderTextColor="darkgray"
            onChangeText={text => createPostwhatQuantity(text)}
            style={styles.quntitiyInput}></TextInput>
        </View> */}

        {/* <View style={styles.quntitiyCont}>
          <Text style={styles.textOne}>Quantity</Text>
          <TextInput
            keyboardType="numeric"
            placeholder="how many?"
            value={forQuantity}
            placeholderTextColor="darkgray"
            onChangeText={text => createPostforQuantity(text)}
            style={styles.quntitiyInput}></TextInput>
        </View> */}

        <View style={styles.createPostCont}>
          {/* <Text style={styles.textOne}>When</Text> */}
          {/* <ImageComponent
            resizeMode="cover"
            source={postCalender}
            style={styles.createImgOne}></ImageComponent> */}

          {/* <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setOpen(true)}
            style={styles.postInputTwo}>
            <Text style={styles.time}>
              {`${moment(range.startDate).format('DD MMM YYYY hh:mm A')}`}
            </Text>

          
          </TouchableOpacity> */}

          {/* <View>
            <TouchableOpacity activeOpacity={0.8} style={styles.postdate}>
              <ImageComponent
                source={postCalender}
                style={styles.calendar}
              />
              <ImageComponent
                source={arrowDown}
                style={{height: 10, width: 10}}
              />

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setOpen(true)}>
                <Text style={styles.time}>
                  {`${moment(range?.startDate).format(
                    'h:mma MMM D, YYYY',
                  )}`}
                  -
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setOpen(true)}>
                <Text style={styles.time}>{`${moment(
                  range?.endDate,
                ).format('h:mma MMM D, YYYY')}`}</Text>
              </TouchableOpacity>
            </TouchableOpacity>
            {/* <Text>+ add an additional timerange</Text> */}
          {/* </View> */}
        </View>

        {/* <TouchableOpacity
                onPress={() => onSubmit(postData())}
                activeOpacity={0.8}
                style={styles.purchaseContainer}
              > */}
        <View style={styles.bottomButton}>
          <ButtonComponent
            onPress={() => onSubmit(postData())}
            icon={buttonArrowGreen}
            title={strings.postOffer}
            style={styles.postButton}
            // disabled={() => validator?.(postData()) ?? false}
          />
        </View>
        {/* </TouchableOpacity> */}
      </View>
    </>
  );
};
