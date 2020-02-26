import React, { useRef } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, EmptyContainer, Section } from '../../components';
import { TodaysCompletedGoals, TodaysIncompleteGoals, TodaysStats } from '../../containers';
import { NavigationMaterialTabScreenComponent } from 'react-navigation-tabs';
import { useDispatchCurrentDateOnRender } from '../../utilities';
import { useStore } from 'react-redux';
import { getGoalsForDate } from '../../store/goals/selectors';
import { Icons } from '../../../assets';

export const TodaysGoalsScreen: NavigationMaterialTabScreenComponent = ({ navigation }) => {
  useDispatchCurrentDateOnRender();

  const scrollViewRef = useRef(null);

  const storeState = useStore().getState();
  const todaysGoals = getGoalsForDate(storeState, new Date());

  function handleAddButtonPress() {
    navigation.navigate('AddGoal');
  }

  function handleEditActionInteraction(goalId: string) {
    navigation.navigate('EditGoal', { goalId });
  }

  function handleInfoActionInteraction(goalId: string) {
    navigation.navigate('GoalInfo', { goalId, date: new Date() });
  }

  function handleChangeScrollEnabled(scrollEnabled: boolean) {
    // @ts-ignore
    scrollViewRef.current?.setNativeProps({ scrollEnabled });
  }

  return (
    <ScrollView ref={scrollViewRef} contentContainerStyle={styles.contentContainer}>
      {todaysGoals.length > 0 && (
        <>
          <Section title="Today's Stats">
            <TodaysStats />
          </Section>

          <Section title='Incomplete Goals'>
            <TodaysIncompleteGoals onEditActionInteraction={handleEditActionInteraction}
                                   onInfoActionInteraction={handleInfoActionInteraction}
                                   onChangeScrollEnabled={handleChangeScrollEnabled} />
          </Section>

          <Section title='Completed Goals'>
            <TodaysCompletedGoals onEditActionInteraction={handleEditActionInteraction}
                                  onInfoActionInteraction={handleInfoActionInteraction}
                                  onChangeScrollEnabled={handleChangeScrollEnabled} />
          </Section>
        </>
      )}

      {todaysGoals.length === 0 && (
        <EmptyContainer text="There aren't any goals for today yet." style={styles.emptyContainer}>
          <Button title='Add a Goal' iconSource={Icons.goal} onPress={handleAddButtonPress}
                  style={styles.addGoalButton} />
        </EmptyContainer>
      )}
    </ScrollView>
  );
};

TodaysGoalsScreen.navigationOptions = {
  title: 'Goals',
};

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
  },
  emptyContainer: {
    paddingBottom: 100,
  },
  addGoalButton: {
    width: 200,
    marginTop: 30,
  },
});
