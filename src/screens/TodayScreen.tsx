import React from 'react';
import { NavigationScreenComponent } from 'react-navigation';
import { BackgroundView, Body } from '../components';

export const TodayScreen: NavigationScreenComponent = () => {
  return (
    <BackgroundView>
      <Body>Today Screen</Body>
    </BackgroundView>
  );
};

TodayScreen.navigationOptions = {
  title: 'Today',
};