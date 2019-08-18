import React from 'react';
import {
  createBottomTabNavigator,
  createStackNavigator,
  createAppContainer,
} from 'react-navigation';
import Storybook from './storybook';
import { colors, fonts } from './src/theme';
import {
  SettingsScreen,
  TodayScreen,
  TomorrowScreen,
  StatsScreen,
} from './src/screens';
import { Image, YellowBox } from 'react-native';
import { Icons } from './assets';

YellowBox.ignoreWarnings(['Warning: Async Storage has been extracted from']);
YellowBox.ignoreWarnings(['Warning: componentWillReceiveProps is deprecated']);
YellowBox.ignoreWarnings(['Warning: componentWillMount is deprecated']);

// export default Storybook;

const TodayStack = createStackNavigator({
  Today: TodayScreen,
});

const TomorrowStack = createStackNavigator({
  Tomorrow: TomorrowScreen,
});

const StatsStack = createStackNavigator({
  Stats: StatsScreen,
});

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
});

const AppNavigator = createBottomTabNavigator(
  {
    Today: TodayStack,
    Tomorrow: TomorrowStack,
    Stats: StatsStack,
    Settings: SettingsStack,
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state;

        return <Image source={getTabIcon(routeName, focused)} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: colors.orange,
      inactiveTintColor: colors.lightGray,
      labelStyle: {
        fontFamily: fonts.semibold,
        fontSize: 12,
        marginTop: 4,
        marginBottom: -2,
      },
      style: {
        height: 60,
        paddingVertical: 8,
      },
    },
  },
);

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}

function getTabIcon(routeName: string, focused: boolean) {
  switch (routeName) {
    case 'Today':
      return focused ? Icons.todayActive : Icons.todayInactive;
    case 'Tomorrow':
      return focused ? Icons.tomorrowActive : Icons.tomorrowInactive;
    case 'Stats':
      return focused ? Icons.statsActive : Icons.statsInactive;
    case 'Settings':
      return focused ? Icons.settingsActive : Icons.settingsInactive;
  }

  return null;
}
