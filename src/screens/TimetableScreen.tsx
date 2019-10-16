import React from 'react';
import { Text } from 'react-native';
import { textStyles } from '../theme';
import { NavigationMaterialTabScreenComponent } from 'react-navigation-tabs';
import { TodaysTimetable } from '../containers';

export const TimetableScreen: NavigationMaterialTabScreenComponent = () => {
  return (
    <TodaysTimetable />
  );
};
