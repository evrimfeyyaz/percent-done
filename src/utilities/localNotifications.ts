import PushNotification, { PushNotificationPermissions } from 'react-native-push-notification';

/**
 * Calling PushNotification.requestPermissions() twice causes a known error:
 * https://github.com/facebook/react-native/issues/9105
 *
 * This variable holds information on whether the promise has returned,
 * as we can only call it safely if it has.
 */
let hasRequestPermissionPromiseReturned = true;

export function scheduleLocalNotification(message: string, date: Date, title?: string): string {
  const id = Math.floor(Math.random() * 1024).toString();

  const scheduleIfPermitted = (permissions: PushNotificationPermissions): boolean => {
    if (!permissions.alert) return false;

    PushNotification.localNotificationSchedule({
      id,
      userInfo: {
        id,
      },
      title,
      message,
      date,
    });

    return true;
  };

  PushNotification.checkPermissions(permissions => {
    const isPermitted = scheduleIfPermitted(permissions);

    if (!isPermitted && hasRequestPermissionPromiseReturned) {
      hasRequestPermissionPromiseReturned = false;
      PushNotification.requestPermissions().then(permissions => {
        hasRequestPermissionPromiseReturned = true;
        scheduleIfPermitted(permissions);
      });
    }
  });

  return id;
}

export function cancelLocalNotification(id: string) {
  PushNotification.cancelLocalNotifications({ id });
}
