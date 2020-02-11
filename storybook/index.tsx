import { AppRegistry } from 'react-native';
import { getStorybookUI, configure } from '@storybook/react-native';

import './rn-addons';
import SplashScreen from "react-native-splash-screen";

// import stories
configure(() => {
  require('./stories');
  SplashScreen.hide();
}, module);

// Refer to https://github.com/storybookjs/storybook/tree/master/app/react-native#start-command-parameters
// To find allowed options for getStorybookUI
const StorybookUIRoot = getStorybookUI({
  asyncStorage: require('@react-native-community/async-storage').AsyncStorage,
  shouldPersistSelection: true,
});

// If you are using React Native vanilla and after installation you don't see your app name here, write it manually.
// If you use Expo you can safely remove this line.
AppRegistry.registerComponent('PercentDone', () => StorybookUIRoot);

export default StorybookUIRoot;
