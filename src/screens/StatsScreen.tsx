import React from 'react';
import { NavigationScreenComponent } from 'react-navigation';
import { BackgroundView, Body } from '../components';

export const StatsScreen: NavigationScreenComponent = () => {
  return (
    <BackgroundView>
      <Body>Stats Screen</Body>
    </BackgroundView>
  );
};

StatsScreen.navigationOptions = {
  title: 'Stats',
};