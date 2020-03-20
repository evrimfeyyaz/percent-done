import firebase from 'react-native-firebase';
import { Sounds } from './soundUtilities';

export function configureNotifications() {
  const goalCompletedChannel = new firebase.notifications.Android.Channel('goal-completed-channel', 'Goal Completed', firebase.notifications.Android.Importance.High);
  goalCompletedChannel.setSound(Sounds.goalCompletedSound);
  const breakChannel = new firebase.notifications.Android.Channel('break-channel', 'Take a Break', firebase.notifications.Android.Importance.High);
  breakChannel.setSound(Sounds.breakSound);
  firebase.notifications().android.createChannel(goalCompletedChannel);
  firebase.notifications().android.createChannel(breakChannel);
}
