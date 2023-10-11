import {useAppTheme} from '@app-hooks/use-app-theme';
import React, {useState} from 'react';
import {createStyleSheet} from './style';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';

interface TabComponentProps {
  tabs: string[];
  onPressTab?: (index: number) => void;
}

interface ItemProps {
  item: string;
  index: number;
}

export const TabComponent = (props: TabComponentProps) => {
  const {theme} = useAppTheme();
  const styles = createStyleSheet(theme);
  const {tabs, onPressTab} = props || {};
  const [selctedIndex, setSelectedIndex] = useState(0);

  const onSelectTab = (index: number) => {
    setSelectedIndex(index);
    onPressTab?.(index);
  };

  const renderItem = (data: ItemProps) => {
    const {item, index} = data || {};

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={[
          styles.container,
          selctedIndex === index && styles.selectedContainer,
        ]}
        onPress={() => onSelectTab(index)}>
        <Text style={styles.label}>{item}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <FlatList
        data={tabs}
        renderItem={renderItem}
        keyExtractor={item => item.toString()}
        horizontal
        contentContainerStyle={styles.tabContainer}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};
