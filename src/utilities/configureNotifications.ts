import firebase, { RNFirebase } from 'react-native-firebase';
import { Dispatch } from 'redux';
import { setShouldTakeBreak } from '../store/settings/actions';

export function configureNotifications(dispatch: Dispatch<any>) {
  const goalCompletedChannel = new firebase.notifications.Android.Channel('goal-completed-channel', 'Goal Completed', firebase.notifications.Android.Importance.High);
  goalCompletedChannel.setSound('arpeggio.mp3');
  const breakChannel = new firebase.notifications.Android.Channel('break-channel', 'Take a Break', firebase.notifications.Android.Importance.High);
  breakChannel.setSound('arpeggio.mp3');
  firebase.notifications().android.createChannel(goalCompletedChannel);
  firebase.notifications().android.createChannel(breakChannel);

  firebase.notifications().onNotification(handleNotification);
  firebase.notifications().onNotificationDisplayed(handleNotification);
  firebase.notifications().onNotificationOpened(notificationOpen => handleNotification(notificationOpen.notification));

  firebase.notifications().getInitialNotification()
    .then(notificationOpen => handleNotification(notificationOpen.notification))
    .catch(() => console.log('No initial notification.'));

  function handleNotification(notification: RNFirebase.notifications.Notification) {
    if (notification.data.channelId === 'break-channel') {
      dispatch(setShouldTakeBreak(true));
    }
  }
}
