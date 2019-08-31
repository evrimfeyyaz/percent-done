import React from 'react';
import {
  createBottomTabNavigator,
  createStackNavigator,
  createAppContainer, TabRouter, createNavigator,
} from 'react-navigation';
import Storybook from './storybook';
import { colors, fonts } from './src/theme';
import {
  SettingsScreen,
  TomorrowScreen,
  StatsScreen, GoalsScreen, TimetableScreen,
} from './src/screens';
import { Image, YellowBox } from 'react-native';
import { Icons } from './assets';
import { TabNavigationView } from './src/components';
import { combineReducers, createStore } from 'redux';
import { goalReducer } from './src/store/goal/reducers';

YellowBox.ignoreWarnings(['Warning: Async Storage has been extracted from']);
YellowBox.ignoreWarnings(['Warning: componentWillReceiveProps is deprecated']);
YellowBox.ignoreWarnings(['Warning: componentWillMount is deprecated']);

export default Storybook;

const router = TabRouter(
  {
    Goals: GoalsScreen,
    Timetable: TimetableScreen,
  },
  {
    initialRouteName: 'Goals',
  },
);

const TodayTabsNavigator = createNavigator(
  TabNavigationView,
  router,
  {
    navigationOptions: {
      title: 'Today',
    },
  },
);

const TodayStack = createStackNavigator({
    Today: TodayTabsNavigator,
  },
);

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

// const rootReducer = combineReducers();
// const store = createStore(rootReducer);

// export default class App extends React.Component {
//   render() {
//     return <AppContainer />;
//   }
// }

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
