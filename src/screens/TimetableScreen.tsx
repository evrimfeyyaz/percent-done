import React from 'react';
import { NavigationMaterialTabScreenComponent } from 'react-navigation-tabs';
import { TodaysTimetable } from '../containers';
import { ScrollView, StyleSheet } from 'react-native';

export const TimetableScreen: NavigationMaterialTabScreenComponent = () => {
  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <TodaysTimetable />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 100,
  },
});
