import React from 'react';
import { NavigationScreenComponent } from 'react-navigation';
import { BackgroundView, Body } from '../components';

export const TimetableScreen: NavigationScreenComponent = () => {
  return (
    <BackgroundView>
      <Body>Timetable Screen</Body>
    </BackgroundView>
  );
};