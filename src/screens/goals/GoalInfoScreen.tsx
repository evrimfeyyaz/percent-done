import React from 'react';
import { NavigationStackScreenComponent } from 'react-navigation-stack';
import { BackgroundView } from '../../components';
import { GoalInfo } from '../../containers';

export const GoalInfoScreen: NavigationStackScreenComponent = ({ navigation }) => {
  return (
    <BackgroundView>
      <GoalInfo goalId={navigation.getParam('goalId')} date={navigation.getParam('date')} />
    </BackgroundView>
  );
};

GoalInfoScreen.navigationOptions = {
  title: 'Goal Information',
};
