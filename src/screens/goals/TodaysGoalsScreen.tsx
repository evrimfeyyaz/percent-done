import React, { useRef } from 'react';
import { ScrollView } from 'react-native';
import { Section } from '../../components';
import { TodaysCompletedGoals, TodaysIncompleteGoals, TodaysStats } from '../../containers';
import { NavigationMaterialTabScreenComponent } from 'react-navigation-tabs';
import { useDispatchCurrentDateOnRender } from '../../utilities';

export const TodaysGoalsScreen: NavigationMaterialTabScreenComponent = ({ navigation }) => {
  useDispatchCurrentDateOnRender();
  const scrollViewRef = useRef(null);

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
    <ScrollView ref={scrollViewRef}>
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
    </ScrollView>
  );
};

TodaysGoalsScreen.navigationOptions = {
  title: 'Goals',
};
