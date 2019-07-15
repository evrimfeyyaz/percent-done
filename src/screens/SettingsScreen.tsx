import React from 'react';
import { Text } from 'react-native';
import { NavigationScreenComponent } from 'react-navigation';
import { BackgroundView, textStyles } from '../components';

export const SettingsScreen: NavigationScreenComponent = () => {
  return (
    <BackgroundView>
      <Text style={textStyles.body}>Settings Screen</Text>
    </BackgroundView>
  );
};

SettingsScreen.navigationOptions = {
  title: 'Settings',
};