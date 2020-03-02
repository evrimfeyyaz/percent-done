import React from 'react';
import { NavigationStackScreenComponent } from 'react-navigation-stack';
import { BackgroundView, BreakNotifications } from '../../components';
import { useDispatch, useSelector } from 'react-redux';
import { StoreState } from '../../store/types';
import { setAreBreakNotificationsOn, setNotifyBreakAfterInMs } from '../../store/settings/actions';

export const BreakNotificationsScreen: NavigationStackScreenComponent = () => {
  const dispatch = useDispatch();

  const areNotificationsOn = useSelector<StoreState, boolean>(state => state.settings.areBreakNotificationsOn);
  const notifyAfterInMs = useSelector<StoreState, number>(state => state.settings.notifyBreakAfterInMs);

  const handleAreNotificationsOnChange = (areNotificationsOn: boolean) => {
    dispatch(setAreBreakNotificationsOn(areNotificationsOn));
  };

  const handleNotifyAfterInMsChange = (notifyAfterInMs: number) => {
    dispatch(setNotifyBreakAfterInMs(notifyAfterInMs));
  };

  return (
    <BackgroundView>
      <BreakNotifications
        areNotificationsOn={areNotificationsOn}
        notifyAfterInMs={notifyAfterInMs}
        onAreNotificationsOnChange={handleAreNotificationsOnChange}
        onNotifyAfterInMsChange={handleNotifyAfterInMsChange}
      />
    </BackgroundView>
  );
};

BreakNotificationsScreen.navigationOptions = {
  title: 'Break Notifications',
};
