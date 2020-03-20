import firebase from 'react-native-firebase';
import { Platform } from 'react-native';
import { Sounds } from './soundUtilities';
import { colors } from '../theme';

export type NotificationChannelId = 'goal-completed-channel' | 'break-channel';

export function scheduleLocalNotification(message: string, date: Date, channelId: NotificationChannelId, title?: string): string {
  const id = Math.floor(Math.random() * 1024).toString();

  const notification = new firebase.notifications.Notification()
    .setNotificationId(id)
    .setBody(message)
    .setData({
      channelId,
    });

  if (Platform.OS === 'android') {
    notification.android.setChannelId(channelId);
    notification.android.setSmallIcon('ic_stat_ic_notification');
    notification.android.setColor(colors.darkBlue);
  }

  if (channelId === 'goal-completed-channel') {
    notification.setSound(Sounds.goalCompletedSound);
  }

  if (channelId === 'break-channel') {
    notification.setSound(Sounds.breakSound);
  }

  if (title != null) {
    notification.setTitle(title);
  }

  requestLocalNotificationPermissions().then(() => {
    firebase.notifications().scheduleNotification(notification, {
      fireDate: date.getTime(),
    });
  });

  return id;
}

export function scheduleGoalCompletedNotification(date: Date, goalTitle: string) {
  const message = 'Your goal is completed. Great job!';
  const channelId = 'goal-completed-channel';
  const notificationId = scheduleLocalNotification(message, date, channelId, goalTitle);

  return notificationId;
}

export function scheduleBreakNotification(date: Date, goalTitle: string) {
  const message = 'Time to take a break.';
  const channelId = 'break-channel';
  const notificationId = scheduleLocalNotification(message, date, channelId, goalTitle);

  return notificationId;
}

export function cancelLocalNotification(id: string) {
  firebase.notifications().cancelNotification(id);
}

export async function requestLocalNotificationPermissions(): Promise<void> {
  return firebase.messaging().requestPermission();
}

export async function checkPermissions(): Promise<boolean> {
  return firebase.messaging().hasPermission();
}
