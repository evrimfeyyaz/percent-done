import React from 'react';
import { Text } from 'react-native';
import { NavigationScreenComponent } from 'react-navigation';
import { textStyles } from '../theme';

export const GoalsScreen: NavigationScreenComponent = () => {
  return (
    <Text style={textStyles.body}>Goals Screen</Text>
  );
};
