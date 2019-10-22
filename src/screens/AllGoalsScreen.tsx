import React from 'react';
import { BackgroundView } from '../components';
import { NavigationStackScreenComponent } from 'react-navigation-stack';
import { AllGoals } from '../containers/AllGoals';
import { StyleSheet } from 'react-native';

export const AllGoalsScreen: NavigationStackScreenComponent = ({ navigation }) => {
  const handleRightActionPress = (goalId: string) => {
    navigation.navigate('EditGoal', { goalId });
  };

  return (
    <BackgroundView style={styles.container}>
      <AllGoals onRightActionPress={handleRightActionPress} />
    </BackgroundView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 30,
    paddingHorizontal: 10,
  },
});

AllGoalsScreen.navigationOptions = {
  title: 'All Goals',
};
