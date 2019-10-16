import React from 'react';
import { Text } from 'react-native';
import { BackgroundView } from '../components';
import { textStyles } from '../theme';
import { NavigationStackScreenComponent } from 'react-navigation-stack';

export const SettingsScreen: NavigationStackScreenComponent = () => {
  return (
    <BackgroundView>
      <Text style={textStyles.body}>Settings Screen</Text>
    </BackgroundView>
  );
};

SettingsScreen.navigationOptions = {
  title: 'Settings',
};
