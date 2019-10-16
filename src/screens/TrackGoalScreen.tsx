import React from 'react';
import { BackgroundView } from '../components';
import { GoalTracker } from '../containers';
import { NavigationStackScreenComponent } from 'react-navigation-stack';

export const TrackGoalScreen: NavigationStackScreenComponent = () => {
  return (
    <BackgroundView>
      <GoalTracker />
    </BackgroundView>
  );
};
