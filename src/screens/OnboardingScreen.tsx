import React from 'react';
import { NavigationStackScreenComponent } from 'react-navigation-stack';
import { Onboarding } from '../components';
import { useDispatch } from 'react-redux';
import { setOnboarded } from '../store/settings/actions';
import { requestLocalNotificationPermissions } from '../utilities/localNotifications';

export const OnboardingScreen: NavigationStackScreenComponent = ({ navigation }) => {
  const dispatch = useDispatch();

  const handleDoneOrSkip = () => {
    dispatch(setOnboarded(true));
    navigation.navigate('MainTabs');
  };

  const handleAddGoalPress = () => {
    navigation.navigate('AddGoal');
  };

  const handleTurnOnNotificationsPress = () => {
    requestLocalNotificationPermissions();
  };

  return (
    <Onboarding
      onDone={handleDoneOrSkip}
      onSkip={handleDoneOrSkip}
      onAddGoalPress={handleAddGoalPress}
      onTurnOnNotificationsPress={handleTurnOnNotificationsPress}
    />
  );
};
