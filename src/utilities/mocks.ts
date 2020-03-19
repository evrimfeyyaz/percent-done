// From: https://medium.com/@rui.fernandes/react-native-jest-react-native-firebase-b5245d8ddd1
jest.mock('react-native-firebase', () => {
  return {
    messaging: jest.fn(() => {
      return {
        hasPermission: jest.fn(() => Promise.resolve(true)),
        subscribeToTopic: jest.fn(),
        unsubscribeFromTopic: jest.fn(),
        requestPermission: jest.fn(() => Promise.resolve(true)),
        getToken: jest.fn(() => Promise.resolve('myMockToken')),
      };
    }),
    notifications: jest.fn(() => {
      return {
        onNotification: jest.fn(),
        onNotificationDisplayed: jest.fn(),
        scheduleNotification: jest.fn(),
      };
    }),
  };
});

jest.mock('./NavigationService', () => ({
  NavigationService: {
    navigate: jest.fn(),
  },
}));

jest.mock('./localNotifications', () => ({
  scheduleLocalNotification: jest.fn(),
  cancelLocalNotification: jest.fn(),
}));

export {};
