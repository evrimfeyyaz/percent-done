import React from 'react';
import { NavigationScreenComponent } from 'react-navigation';
import { BackgroundView, Body } from '../components';

export const TomorrowScreen: NavigationScreenComponent = () => {
  return (
    <BackgroundView>
      <Body>Tomorrow Screen</Body>
    </BackgroundView>
  );
};

TomorrowScreen.navigationOptions = {
  title: 'Tomorrow',
};