import React from 'react';
import { Text } from 'react-native';
import { textStyles } from '../theme';
import { NavigationStackScreenComponent } from 'react-navigation-stack';

export const StatsScreen: NavigationStackScreenComponent = () => {
  return (
    <Text style={textStyles.body}>Stats Screen</Text>
  );
};

StatsScreen.navigationOptions = {
  title: 'Stats',
};
