import React from 'react';
import { NavigationMaterialTabScreenComponent } from 'react-navigation-tabs';
import { TodaysTimetable } from '../containers';
import { ScrollView, StyleSheet } from 'react-native';

export const TodaysTimetableScreen: NavigationMaterialTabScreenComponent = ({ navigation }) => {
  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <TodaysTimetable onAddButtonPress={() => navigation.navigate('AddTimetableEntry')} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingVertical: 10,
  },
});
