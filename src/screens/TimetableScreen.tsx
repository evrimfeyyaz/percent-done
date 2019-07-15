import React from 'react';
import { Text } from 'react-native';
import { NavigationScreenComponent } from 'react-navigation';
import { BackgroundView, textStyles } from '../components';

export const TimetableScreen: NavigationScreenComponent = () => {
  return (
    <BackgroundView>
      <Text style={textStyles.body}>Timetable Screen</Text>
    </BackgroundView>
  );
};