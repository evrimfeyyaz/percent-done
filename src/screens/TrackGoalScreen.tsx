import React, { useEffect } from 'react';
import { BackgroundView } from '../components';
import { GoalTracker } from '../containers';
import { NavigationStackScreenComponent } from 'react-navigation-stack';
import { StatusBar } from 'react-native';

export const TrackGoalScreen: NavigationStackScreenComponent = ({ navigation }) => {
  useEffect(() => {
    navigation.addListener('willBlur', () => StatusBar.setBarStyle('dark-content', true));
    StatusBar.setBarStyle('light-content', true);
  }, []);

  return (
    <BackgroundView>
      <GoalTracker />
    </BackgroundView>
  );
};
