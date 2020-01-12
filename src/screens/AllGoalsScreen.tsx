import React from 'react';
import { NavigationStackScreenComponent } from 'react-navigation-stack';
import { AllGoals } from '../containers/AllGoals';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../components';
import { textStyles } from '../theme';
import { Icons } from '../../assets';

export const AllGoalsScreen: NavigationStackScreenComponent = ({ navigation }) => {
  const handleEditActionInteraction = (goalId: string) => {
    navigation.navigate('EditGoal', { goalId });
  };

  const handleAddButtonPress = () => {
    navigation.navigate('AddGoal');
  };

  return (
    <>
      <View style={styles.header}>
        <Button title='Add Goal' style={styles.addGoalButton} iconSource={Icons.goal} onPress={handleAddButtonPress} />
        <Text style={[styles.goalsDescription, textStyles.body]}>
          Goals are tasks you would like to track day by day,
          such as "writing for an hour every day" or "exercising Monday to Friday."
        </Text>
      </View>

      <AllGoals onEditActionInteraction={handleEditActionInteraction} />
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalsDescription: {
    textAlign: 'center',
    marginHorizontal: 40,
  },
  addGoalButton: {
    width: 200,
    marginBottom: 20,
  },
});
