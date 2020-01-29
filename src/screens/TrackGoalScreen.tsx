import React, { useEffect } from 'react';
import { BackgroundView } from '../components';
import { GoalTracker } from '../containers';
import { NavigationStackScreenComponent } from 'react-navigation-stack';
import { setStatusBarStyle } from '../utilities/statusBar';

export const TrackGoalScreen: NavigationStackScreenComponent = ({ navigation }) => {
  useEffect(() => {
    navigation.addListener('willBlur', () => {
      console.log('will blur');
      setStatusBarStyle('dark');
    });

    setStatusBarStyle('light');
  }, []);

  return (
    <BackgroundView>
      <GoalTracker />
    </BackgroundView>
  );
};
