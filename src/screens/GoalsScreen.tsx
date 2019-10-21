import React from 'react';
import { BackgroundView } from '../components';
import { NavigationStackScreenComponent } from 'react-navigation-stack';
import { AllGoals } from '../containers/AllGoals';
import { StyleSheet } from 'react-native';

export const GoalsScreen: NavigationStackScreenComponent = () => {
  return (
    <BackgroundView style={styles.container}>
      <AllGoals />
    </BackgroundView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 30,
    paddingHorizontal: 10,
  },
});

GoalsScreen.navigationOptions = {
  title: 'Goals',
};
