import firebase from 'react-native-firebase';

export function configureNotifications() {
  const goalCompletedChannel = new firebase.notifications.Android.Channel('goal-completed-channel', 'Goal Completed', firebase.notifications.Android.Importance.High);
  goalCompletedChannel.setSound('arpeggio.mp3');
  const breakChannel = new firebase.notifications.Android.Channel('break-channel', 'Take a Break', firebase.notifications.Android.Importance.High);
  breakChannel.setSound('arpeggio.mp3');
  firebase.notifications().android.createChannel(goalCompletedChannel);
  firebase.notifications().android.createChannel(breakChannel);
}
