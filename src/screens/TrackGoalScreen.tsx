import React from 'react';
import { NavigationScreenComponent } from 'react-navigation';
import { BackgroundView } from '../components';
import { GoalTracker } from '../containers';

export const TrackGoalScreen: NavigationScreenComponent = () => {
  return (
    <BackgroundView>
      <GoalTracker />
    </BackgroundView>
  );
};
