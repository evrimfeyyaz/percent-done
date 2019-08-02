import React from 'react';
import { Text } from 'react-native';
import { NavigationScreenComponent } from 'react-navigation';
import { BackgroundView } from '../components';
import { textStyles } from '../theme';

export const TimetableScreen: NavigationScreenComponent = () => {
  return (
    <BackgroundView>
      <Text style={textStyles.body}>Timetable Screen</Text>
    </BackgroundView>
  );
};
