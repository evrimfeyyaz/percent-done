import firebase from 'react-native-firebase';
import { Platform } from 'react-native';

export type NotificationChannelId = 'goal-completed-channel' | 'break-channel';

export function scheduleLocalNotification(message: string, date: Date, channelId: NotificationChannelId, title?: string): string {
  const id = Math.floor(Math.random() * 1024).toString();

  const notification = new firebase.notifications.Notification()
    .setNotificationId(id)
    .setBody(message)
    .setSound('arpeggio.mp3')
    .setData({
      channelId,
    });

  if (Platform.OS === 'android') {
    notification.android.setChannelId(channelId);
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

export function cancelLocalNotification(id: string) {
  firebase.notifications().cancelNotification(id);
}

export async function requestLocalNotificationPermissions(): Promise<void> {
  return firebase.messaging().requestPermission();
}

export async function checkPermissions(): Promise<boolean> {
  return firebase.messaging().hasPermission();
}
