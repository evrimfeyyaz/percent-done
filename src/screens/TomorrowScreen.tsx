import React from 'react';
import { Text } from 'react-native';
import { NavigationScreenComponent } from 'react-navigation';
import { BackgroundView, textStyles } from '../components';

export const TomorrowScreen: NavigationScreenComponent = () => {
  return (
    <BackgroundView>
      <Text style={textStyles.body}>Tomorrow Screen</Text>
    </BackgroundView>
  );
};

TomorrowScreen.navigationOptions = {
  title: 'Tomorrow',
};