jest.mock('react-native-push-notification', () => ({
  checkPermissions: jest.fn((callback) => {
    callback({ alert: true });
  }),
  localNotificationSchedule: jest.fn(),
  cancelLocalNotifications: jest.fn(),
}));

jest.mock('./NavigationService', () => ({
  NavigationService: {
    navigate: jest.fn(),
  },
}));

export {};
