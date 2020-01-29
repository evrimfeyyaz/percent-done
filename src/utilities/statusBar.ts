import { Platform, StatusBar } from 'react-native';
import { colors } from '../theme';

export function setStatusBarStyle(style: 'dark' | 'light') {
  StatusBar.setHidden(false);

  if (Platform.OS === 'android' && Platform.Version < 23) {
    StatusBar.setBackgroundColor(colors.darkBlue);

    return;
  }

  if (style === 'dark') {
    StatusBar.setBarStyle('dark-content', true);

    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(colors.offWhite);
      StatusBar.setTranslucent(false);
    }
  } else {
    StatusBar.setBarStyle('light-content', true);

    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('rgba(0,0,0,0)');
      StatusBar.setTranslucent(true);
    }
  }
}
