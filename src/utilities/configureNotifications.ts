import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';

export function configureNotifications() {
  PushNotification.configure({
    onNotification: (notification) => {
      // Required on iOS only (see fetchCompletionHandler docs: https://github.com/react-native-community/react-native-push-notification-ios)
      notification.finish(PushNotificationIOS.FetchResult.NoData);
    },

    requestPermissions: false,
  });
}
