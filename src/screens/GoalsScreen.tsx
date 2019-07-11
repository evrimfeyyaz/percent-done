import React from 'react';
import { NavigationScreenComponent } from 'react-navigation';
import { BackgroundView, Body } from '../components';

export const GoalsScreen: NavigationScreenComponent = () => {
  return (
    <BackgroundView>
      <Body>Goals Screen</Body>
    </BackgroundView>
  );
};