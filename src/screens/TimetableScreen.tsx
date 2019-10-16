import React from 'react';
import { Text } from 'react-native';
import { textStyles } from '../theme';
import { NavigationMaterialTabScreenComponent } from 'react-navigation-tabs';

export const TimetableScreen: NavigationMaterialTabScreenComponent = () => {
  return (
    <Text style={textStyles.body}>Timetable Screen</Text>
  );
};
