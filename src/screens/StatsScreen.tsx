import React from 'react';
import { Text } from 'react-native';
import { BackgroundView } from '../components';
import { textStyles } from '../theme';
import { NavigationStackScreenComponent } from 'react-navigation-stack';

export const StatsScreen: NavigationStackScreenComponent = () => {
  return (
    <BackgroundView>
      <Text style={textStyles.body}>Stats Screen</Text>
    </BackgroundView>
  );
};

StatsScreen.navigationOptions = {
  title: 'Stats',
};
