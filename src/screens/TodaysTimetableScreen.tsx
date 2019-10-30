import React from 'react';
import { NavigationMaterialTabScreenComponent } from 'react-navigation-tabs';
import { TodaysTimetable } from '../containers';
import { ScrollView, StyleSheet } from 'react-native';

export const TodaysTimetableScreen: NavigationMaterialTabScreenComponent = () => {
  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <TodaysTimetable />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingVertical: 10,
  },
});
