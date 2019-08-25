import React from 'react';
import { Text } from 'react-native';
import { NavigationScreenComponent } from 'react-navigation';
import { textStyles } from '../theme';

export const TimetableScreen: NavigationScreenComponent = () => {
  return (
    <Text style={textStyles.body}>Timetable Screen</Text>
  );
};
