import React, { FunctionComponent, useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors, fonts } from '../../theme';
import { Button, TextInput } from '../';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import { createRandomId } from '../../utilities';

interface SelectBoxProps {
  data: {
    key: string;
    title: string;
  }[];
  cancelButtonTitle: string;
  onItemPress?: (key: string) => void;
  onCreatePress?: (title: string) => void;
  onCancelPress?: () => void;
}

export const SelectBox: FunctionComponent<SelectBoxProps> = ({ data, cancelButtonTitle, onItemPress, onCreatePress, onCancelPress }) => {
  const [value, setValue] = useState('');
  const [filteredData, setFilteredData] = useState(data);
  const [createButtonItemKey] = useState(createRandomId());

  useEffect(() => {
    const newFilteredData = data
      ?.filter(item => item.title.toLocaleLowerCase().includes(value.toLocaleLowerCase()))
      .sort((item1, item2) => item1.title.localeCompare(item2.title)) || [];

    if (
      !newFilteredData.map(item => item.title.toLocaleLowerCase()).includes(value.toLocaleLowerCase()) &&
      value.trim().length > 0
    ) {
      newFilteredData.unshift({
        key: createButtonItemKey,
        title: `Create "${value}"`,
      });
    }

    setFilteredData(newFilteredData);
  }, [value]);

  const handleTextChange = (text: string) => {
    setValue(text);
  };

  const handleItemPress = (item: { key: string, title: string }) => {
    if (item.key === createButtonItemKey) {
      onCreatePress?.(value);
    } else {
      onItemPress?.(item.key);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder='Enter project name' placeholderColor={colors.darkGray} value={value}
                 style={styles.textInputStyle} onChangeText={handleTextChange} />

      <KeyboardAwareFlatList style={styles.itemList} data={filteredData} initialNumToRender={30}
                             alwaysBounceVertical={false}
                             renderItem={({ item }) => (
                               <TouchableOpacity onPress={() => handleItemPress(item)}>
                                 <View style={styles.item}>
                                   <Text
                                     style={item.key === createButtonItemKey ? styles.createButton : styles.itemTitle}>
                                     {item.title}
                                   </Text>
                                 </View>
                               </TouchableOpacity>
                             )}
      />
      <Button title={cancelButtonTitle} style={styles.cancelButton} onPress={onCancelPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'stretch',
    backgroundColor: colors.white,
    paddingTop: 10,
  },
  textInputStyle: {
    color: colors.black,
  },
  itemList: {
    marginTop: 10,
  },
  item: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  itemTitle: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.black,
  },
  createButton: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    color: colors.orange,
  },
  cancelButton: {
    borderRadius: 0,
    backgroundColor: colors.red,
  },
});
