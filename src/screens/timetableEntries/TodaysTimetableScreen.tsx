import React, { useEffect } from 'react';
import { NavigationMaterialTabScreenComponent } from 'react-navigation-tabs';
import { TodaysTimetable } from '../../containers';
import { LayoutAnimation, ScrollView, StyleSheet } from 'react-native';
import { Icons } from '../../../assets';
import { ListHeader } from '../../components';
import { useDispatchCurrentDateOnRender } from '../../utilities';

export const TodaysTimetableScreen: NavigationMaterialTabScreenComponent = ({ navigation }) => {
  useDispatchCurrentDateOnRender();

  useEffect(() => {
    LayoutAnimation.easeInEaseOut();
  }, []);

  const handleAddButtonPress = () => {
    navigation.navigate('AddTimetableEntry');
  };

  const handleEntryPress = (timetableEntryId: string) => {
    navigation.navigate('EditTimetableEntry', { timetableEntryId });
  };

  return (
    <ScrollView contentContainerStyle={styles.contentContainer} alwaysBounceVertical={false}>
      <ListHeader
        buttonTitle='Add Entry'
        buttonIconSource={Icons.addEntry}
        onButtonPress={handleAddButtonPress}
      />
      <TodaysTimetable onEntryPress={handleEntryPress} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 20,
    alignItems: 'center',
  },
  addEntryButton: {
    width: 200,
    marginBottom: 20,
  },
});
