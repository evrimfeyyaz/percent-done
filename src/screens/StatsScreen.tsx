import React from 'react';
import { Text } from 'react-native';
import { NavigationScreenComponent } from 'react-navigation';
import { BackgroundView, textStyles } from '../components';

export const StatsScreen: NavigationScreenComponent = () => {
  return (
    <BackgroundView>
      <Text style={textStyles.body}>Stats Screen</Text>
    </BackgroundView>
  );
};

StatsScreen.navigationOptions = {
  title: 'Stats',
};