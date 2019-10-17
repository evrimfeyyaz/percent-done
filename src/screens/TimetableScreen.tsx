import React from 'react';
import { NavigationMaterialTabScreenComponent } from 'react-navigation-tabs';
import { TodaysTimetable } from '../containers';
import { ScrollView, StyleSheet } from 'react-native';

export const TimetableScreen: NavigationMaterialTabScreenComponent = () => {
  return (
    <ScrollView contentContainerStyle={styles.contentContainer} centerContent>
      <TodaysTimetable />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 100,
    paddingTop: 30,
  },
});
