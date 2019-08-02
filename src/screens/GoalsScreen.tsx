import React from 'react';
import { Text } from 'react-native';
import { NavigationScreenComponent } from 'react-navigation';
import { BackgroundView } from '../components';
import { textStyles } from '../theme';

export const GoalsScreen: NavigationScreenComponent = () => {
  return (
    <BackgroundView>
      <Text style={textStyles.body}>Goals Screen</Text>
    </BackgroundView>
  );
};
