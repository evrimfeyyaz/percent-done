import React, { useEffect, useState } from 'react';
import { NavigationStackScreenComponent } from 'react-navigation-stack';
import { Onboarding } from '../../components';
import { useDispatch } from 'react-redux';
import { setOnboarded } from '../../store/settings/actions';
import { requestLocalNotificationPermissions } from '../../utilities/localNotifications';
import { setStatusBarStyle } from '../../utilities/statusBar';
import PushNotification, { PushNotificationPermissions } from 'react-native-push-notification';

export const OnboardingScreen: NavigationStackScreenComponent = ({ navigation }) => {
  let numOfTimesNotificationPermissionsChecked = 0;

  const dispatch = useDispatch();
  const [notificationPermissions, setNotificationPermissions] = useState<PushNotificationPermissions>({
    alert: false,
    badge: false,
    sound: false,
  });

  useEffect(() => {
    PushNotification.checkPermissions(permissions => setNotificationPermissions(permissions));
  }, []);

  const handleDoneOrSkip = () => {
    dispatch(setOnboarded(true));
    navigation.navigate('MainTabs');
    setStatusBarStyle('dark');
  };

  const handleAddGoalPress = () => {
    navigation.navigate('AddGoal');
  };

  const handleTurnOnNotificationsPress = () => {
    requestLocalNotificationPermissions();

    // This is a bit of a hack because the Promise that is
    // returned from `requestLocalNotificationPermissions`
    // does not resolve because of a bug in the native code
    // of `PushNotificationsIOS`.
    const intervalId = setInterval(() => {
      PushNotification.checkPermissions(permissions => setNotificationPermissions(permissions));

      numOfTimesNotificationPermissionsChecked++;
      if (numOfTimesNotificationPermissionsChecked === 5) {
        clearInterval(intervalId);
      }
    }, 2000);
  };

  return (
    <Onboarding
      onDone={handleDoneOrSkip}
      onSkip={handleDoneOrSkip}
      onAddGoalPress={handleAddGoalPress}
      onTurnOnNotificationsPress={handleTurnOnNotificationsPress}
      notificationPermissions={notificationPermissions}
    />
  );
};
