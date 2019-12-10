import { AllGoalsScreen, AllProjectsScreen, TodaysGoalsScreen, TodaysTimetableScreen } from '../screens';
import { createStackNavigator } from 'react-navigation-stack';
import { headerConfig } from './headerConfig';
import { createNavigator, TabRouter } from 'react-navigation';
import { HeaderButton, TabNavigationView } from '../components';
import React from 'react';

// export const GoalsAndProjectsTab = createStackNavigator({
//   GoalsAndProjects: GoalsAndProjectsScreen,
// }, {
//   defaultNavigationOptions: { ...headerConfig },
//   navigationOptions: {
//     tabBarLabel: 'Goals & Projects'
//   }
// });

const router = TabRouter(
  {
    Goals: AllGoalsScreen,
    Projects: AllProjectsScreen,
  },
  {
    initialRouteName: 'Goals',
  },
);

/**
 * Tabs within the "Goals & Projects" tab.
 * **/
const TabsNavigator = createNavigator(
  TabNavigationView,
  router,
  {},
);

export const GoalsAndProjectsTab = createStackNavigator({
    GoalsAndProjects: TabsNavigator,
  },
  {
    navigationOptions: {
      tabBarLabel: 'Goals & Projects',
    },
    defaultNavigationOptions: {
      ...headerConfig,
      title: 'Goals & Projects',
    },
  },
);

