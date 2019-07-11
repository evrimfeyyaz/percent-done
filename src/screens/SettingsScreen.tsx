import React from 'react';
import { NavigationScreenComponent } from 'react-navigation';
import { BackgroundView, Body } from '../components';

export const SettingsScreen: NavigationScreenComponent = () => {
  return (
    <BackgroundView>
      <Body>Settings Screen</Body>
    </BackgroundView>
  );
};

SettingsScreen.navigationOptions = {
  title: 'Settings',
};