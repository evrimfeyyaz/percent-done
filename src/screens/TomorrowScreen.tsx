import React from 'react';
import { Text } from 'react-native';
import { BackgroundView } from '../components';
import { textStyles } from '../theme';
import { NavigationStackScreenComponent } from 'react-navigation-stack';

export const TomorrowScreen: NavigationStackScreenComponent = () => {
  return (
    <BackgroundView>
      <Text style={textStyles.body}>Tomorrow Screen</Text>
    </BackgroundView>
  );
};

TomorrowScreen.navigationOptions = {
  title: 'Tomorrow',
};
