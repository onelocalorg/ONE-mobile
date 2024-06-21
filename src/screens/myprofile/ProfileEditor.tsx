import _ from "lodash/fp";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Image,
  ListRenderItem,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-simple-toast";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { addGreen, gratis } from "~/assets/images";
import { ButtonComponent } from "~/components/button-component";
import { FlatListComponent } from "~/components/flatlist-component";
import { ImageComponent } from "~/components/image-component";
import { Input } from "~/components/input";
import { Pill } from "~/components/pill";
import { UserProfile, UserProfileUpdateData } from "~/types/user-profile";
import { removeEmptyFields } from "~/utils/common";
import { createStyleSheet } from "./style";

interface Callback {
  onSuccess: () => void;
}
interface ProfileEditorProps {
  userProfile: UserProfile;
  saveProfile: (data: UserProfileUpdateData, callback?: Callback) => void;
}
export const ProfileEditor = ({
  userProfile,
  saveProfile,
}: ProfileEditorProps) => {
  const { theme } = useAppTheme();
  const { strings } = useStringsAndLabels();
  const styles = createStyleSheet(theme);
  const [allSkills, setSkills] = useState(userProfile.skills);
  const [skillValue, setSkillValue] = useState("");

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UserProfileUpdateData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      nickname: "",
      catchphrase: "",
      about: "",
      skills: [],
      ..._.omit(["gratis", "joinDate", "pic"], userProfile),
    },
  });

  const handleRemoveSkill = (id: string) => {
    const newPeople = allSkills.filter((person) => person !== id);

    setSkills(newPeople);
  };

  const onAddSkill = (text: string) => {
    const foundSkill = allSkills.find((data: string) => data == text);
    if (!foundSkill) {
      if (text !== "" && text !== undefined) {
        setSkills([...allSkills, text]);
        setSkillValue("");
      }
      setValue("skills", [...allSkills, text]);
    } else {
      Toast.show("Already Added", Toast.LONG, {
        backgroundColor: "black",
      });
    }
  };

  const renderSkill: ListRenderItem<string> = ({ item }) => (
    <Pill
      onPressPill={() => handleRemoveSkill(item)}
      pillStyle={styles.marginBottom}
      key={item}
      label={item}
    />
  );

  const onSubmit = (data: UserProfileUpdateData) => {
    saveProfile(removeEmptyFields(data) as UserProfileUpdateData, {
      onSuccess: () => {
        Toast.show("Profile saved", Toast.SHORT, {
          backgroundColor: "black",
        });
      },
    });
  };

  return (
    <View style={{ marginTop: -90 }}>
      <View style={styles.center}>
        <View style={styles.userNameClass}>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                onChangeText={onChange}
                value={value}
                onBlur={onBlur}
                placeholder={strings.firstName}
                placeholderTextColor="#818181"
                style={styles.firstName}
              />
            )}
            name="firstName"
          />
          {errors.firstName && <Text>This is required.</Text>}

          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                onChangeText={onChange}
                value={value}
                onBlur={onBlur}
                placeholder={strings.lastName}
                placeholderTextColor="#818181"
                style={styles.lastName}
              />
            )}
            name="lastName"
          />
        </View>
        {errors.lastName && <Text>This is required.</Text>}

        <View style={styles.circularView}>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                onChangeText={onChange}
                value={value}
                onBlur={onBlur}
                placeholder="enter nickname"
                placeholderTextColor="#818181"
                style={styles.des}
              />
            )}
            name="nickname"
          />
        </View>
      </View>

      <View style={styles.gratiesCont}>
        <View style={styles.payoutAndGratisCont}>
          <Image
            source={gratis}
            resizeMode="cover"
            style={styles.gratiesImage}
          ></Image>
          <Text style={styles.gratiesNumber}>{userProfile.gratis}</Text>
        </View>
      </View>

      <View style={styles.aboutView}>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              inputStyle={styles.input}
              onChangeText={onChange}
              value={value}
              onBlur={onBlur}
              placeholderTextColor="#818181"
              placeholder="enter a catchphrase"
              multiline
            />
          )}
          name="catchphrase"
        />

        <Text style={styles.membership}>{strings.aboutMe}</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              onChangeText={onChange}
              value={value}
              onBlur={onBlur}
              inputStyle={styles.input}
              placeholder="tell us about yourself!"
              placeholderTextColor="#818181"
              multiline
            />
          )}
          name="about"
        />

        <Text style={styles.membership}>{strings.skills}</Text>
        {skillValue !== "" ? (
          <TouchableOpacity
            style={{ zIndex: 1111111 }}
            onPress={() => {
              onAddSkill(skillValue);
            }}
          >
            <ImageComponent
              style={styles.skillAddImage}
              source={addGreen}
            ></ImageComponent>
          </TouchableOpacity>
        ) : (
          <View></View>
        )}

        <View style={styles.skillCont}>
          <Input
            inputStyle={styles.input}
            // onSubmitEditing={onAddSkill}
            placeholder={strings.addSkill}
            value={skillValue}
            onChangeText={setSkillValue}
            placeholderTextColor="#818181"
            children
          />
        </View>

        <View style={styles.row}>
          <FlatListComponent
            data={allSkills}
            keyExtractor={(item) => item.toString()}
            renderItem={renderSkill}
            numColumns={100}
            showsHorizontalScrollIndicator={false}
            columnWrapperStyle={styles.flexWrap}
          />
        </View>
        <ButtonComponent
          title={strings.save}
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </View>
  );
};
