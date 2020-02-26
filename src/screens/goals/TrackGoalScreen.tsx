import React, { useEffect, useState } from 'react';
import { BackgroundView } from '../../components';
import { GoalTracker } from '../../containers';
import { NavigationStackScreenComponent } from 'react-navigation-stack';
import { setStatusBarStyle } from '../../utilities/statusBar';

export const TrackGoalScreen: NavigationStackScreenComponent = ({ navigation }) => {
  const [counter, forceUpdate] = useState(0);

  useEffect(() => {
    navigation.addListener('willBlur', () => {
      setStatusBarStyle('dark');
    });

    setStatusBarStyle('light');
  }, []);

  const handleDateChange = () => {
    forceUpdate(counter + 1);
  };

  return (
    <BackgroundView>
      <GoalTracker onDateChange={handleDateChange} />
    </BackgroundView>
  );
};
