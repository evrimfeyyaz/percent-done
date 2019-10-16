import React from 'react';
import { Image } from 'react-native';
import { colors, fonts } from '../theme';
import { Icons } from '../../assets';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { TodayTab } from './TodayTab';
import { TomorrowTab } from './TomorrowTab';
import { StatsTab } from './StatsTab';
import { SettingsTab } from './SettingsTab';

export const MainNavigator = createBottomTabNavigator(
  {
    Today: TodayTab,
    Tomorrow: TomorrowTab,
    Stats: StatsTab,
    Settings: SettingsTab,
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state;

        return <Image source={getTabIcon(routeName, focused)} />;
      },
      headerStyle: {
        backgroundColor: '#f4511e',
      },
      headerTintColor: '#fff',
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
