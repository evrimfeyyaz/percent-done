import React from 'react';
import { NavigationMaterialTabScreenComponent } from 'react-navigation-tabs';
import { TodaysTimetable } from '../containers';
import { ScrollView, StyleSheet } from 'react-native';
import { Icons } from '../../assets';
import { Button } from '../components';

export const TodaysTimetableScreen: NavigationMaterialTabScreenComponent = ({ navigation }) => {
  const handleAddButtonPress = () => {
    navigation.navigate('AddTimetableEntry');
  };

  const handleEntryPress = (timetableEntryId: string) => {
    navigation.navigate('EditTimetableEntry', { timetableEntryId });
  };

  return (
    <ScrollView contentContainerStyle={styles.contentContainer} alwaysBounceVertical={false}>
      <Button title='Add Entry' iconSource={Icons.addEntry} style={styles.addEntryButton}
              onPress={handleAddButtonPress} />
      <TodaysTimetable onEntryPress={handleEntryPress} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  addEntryButton: {
    width: 200,
    marginBottom: 20,
  },
});
