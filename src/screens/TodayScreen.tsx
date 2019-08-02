import React from 'react';
import { Text } from 'react-native';
import { createMaterialTopTabNavigator, TabRouter } from 'react-navigation';
import { GoalsScreen } from './GoalsScreen';
import { TimetableScreen } from './TimetableScreen';
import { colors, fonts } from '../theme';

const todayTabs = TabRouter(
  {
    Goals: GoalsScreen,
    Timetable: TimetableScreen,
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state;

        return <Text>{routeName}</Text>;
      },
    }),
  },
);

export const TodayScreen = createMaterialTopTabNavigator(
  {
    Goals: GoalsScreen,
    Timetable: TimetableScreen,
  },
  {
    tabBarOptions: {
      labelStyle: {
        fontFamily: fonts.regular,
        fontSize: 20,
        color: colors.white,
      },
      tabStyle: {},
      style: {
        position: 'absolute',
      },
    },
  },
);

TodayScreen.navigationOptions = {
  title: 'Today',
};
