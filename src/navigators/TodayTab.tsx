import React from 'react';
import { createNavigator, TabRouter } from 'react-navigation';
import { HeaderButton, TabNavigationView } from '../components';
import { TodaysGoalsScreen, TodaysTimetableScreen } from '../screens';
import { headerConfig } from './headerConfig';
import { createStackNavigator } from 'react-navigation-stack';

const router = TabRouter(
  {
    Goals: TodaysGoalsScreen,
    Timetable: TodaysTimetableScreen,
  },
  {
    initialRouteName: 'Goals',
  },
);

/**
 * Tabs within the main Today tab.
 * **/
const TabsNavigator = createNavigator(
  TabNavigationView,
  router,
  {},
);

export const TodayTab = createStackNavigator({
    Today: TabsNavigator,
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      ...headerConfig,
      headerRight: (<HeaderButton title='Add Goal' primary onPress={() => navigation.navigate('AddGoal')} />),
      title: 'Today',
    }),
  },
);
