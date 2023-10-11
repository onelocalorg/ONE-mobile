import {useAppTheme} from '@app-hooks/use-app-theme';
import React, {useEffect, useRef, useState} from 'react';
import {ListRenderItem, Text, TouchableOpacity, View} from 'react-native';
import {createStyleSheet} from './style';
import {useStringsAndLabels} from '@app-hooks/use-strings-and-labels';
import {Pill} from '@components/pill';
import {eventWhite, gratitude, save} from '@assets/images';
import {MembershipModal} from './membership-modal';
import {ModalRefProps} from '@components/modal-component';
import {ImageComponent} from '@components/image-component';
import {Input} from '@components/input';
import {FlatListComponent} from '@components/flatlist-component';
import {NavigationContainerRef, ParamListBase} from '@react-navigation/native';

interface AboutProps {
  about: string;
  skills: string[];
  onEditProfile?: (data: {about?: string; skills?: string[]}) => void;
  navigation: NavigationContainerRef<ParamListBase>;
}

export const About = (props: AboutProps) => {
  const {theme} = useAppTheme();
  const {strings} = useStringsAndLabels();
  const styles = createStyleSheet(theme);
  const {about, skills, onEditProfile, navigation} = props || {};
  const [updatedAbout, setAbout] = useState(about);
  const [allSkills, setSkills] = useState(skills);
  const [skillValue, setSkillValue] = useState('');
  const modalRef: React.Ref<ModalRefProps> = useRef(null);

  useEffect(() => {
    setAbout(about);
    setSkills(skills);
  }, [about, skills]);

  const onOpenModal = () => {
    modalRef.current?.onOpenModal();
  };

  const onAddSkill = ({nativeEvent: {text}}: {nativeEvent: {text: string}}) => {
    if (text !== '') {
      setSkills([...allSkills, text]);
      setSkillValue('');
    }
  };

  const onSaveProfile = () => {
    let request = {};

    if (about !== updatedAbout) {
      request = {...request, about: updatedAbout};
    }
    if (skills.length !== allSkills.length) {
      request = {...request, skills: allSkills};
    }
    onEditProfile?.(request);
  };

  const renderItem: ListRenderItem<string> = ({item}) => (
    <Pill pillStyle={styles.marginBottom} disabled key={item} label={item} />
  );

  return (
    <>
      <View style={styles.innerConatiner}>
        <View style={styles.rowOnly}>
          <Text style={styles.membership}>{strings.membership}</Text>
          <TouchableOpacity activeOpacity={0.8} onPress={onSaveProfile}>
            <ImageComponent source={save} style={styles.save} />
          </TouchableOpacity>
        </View>
        <View style={styles.buttonView}>
          <Pill disabled icon={gratitude} label={strings.player} />
          <Pill
            icon={eventWhite}
            label={strings.eventProducer}
            backgroundColor={theme.colors.red}
            onPressPill={onOpenModal}
          />
        </View>
        <Text style={styles.membership}>{strings.aboutMe}</Text>
        <Input
          inputStyle={styles.input}
          value={updatedAbout}
          onChangeText={setAbout}
          multiline
        />
        <Text style={styles.membership}>{strings.skills}</Text>
        <Input
          inputStyle={styles.input}
          onSubmitEditing={onAddSkill}
          placeholder={strings.addSkill}
          value={skillValue}
          onChangeText={setSkillValue}
        />
        <View style={styles.row}>
          <FlatListComponent
            data={allSkills}
            keyExtractor={item => item.toString()}
            renderItem={renderItem}
            numColumns={100}
            showsHorizontalScrollIndicator={false}
            columnWrapperStyle={styles.flexWrap}
          />
        </View>
      </View>
      <MembershipModal navigation={navigation} ref={modalRef} />
    </>
  );
};
