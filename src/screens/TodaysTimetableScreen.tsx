import React from 'react';
import { NavigationMaterialTabScreenComponent } from 'react-navigation-tabs';
import { TodaysTimetable } from '../containers';
import { ScrollView, StyleSheet } from 'react-native';

export const TodaysTimetableScreen: NavigationMaterialTabScreenComponent = ({ navigation }) => {
  const handleAddButtonPress = () => {
    navigation.navigate('AddTimetableEntry');
  };

  const handleEntryPress = (timetableEntryId: string) => {
    navigation.navigate('EditTimetableEntry', { timetableEntryId });
  };

  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <TodaysTimetable onAddButtonPress={handleAddButtonPress} onEntryPress={handleEntryPress} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingVertical: 10,
  },
});
