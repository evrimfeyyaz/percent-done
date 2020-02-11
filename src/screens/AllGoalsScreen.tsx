import React from 'react';
import { NavigationStackScreenComponent } from 'react-navigation-stack';
import { AllGoals } from '../containers/AllGoals';
import { ListHeader } from '../components';
import { Icons } from '../../assets';
import { useDispatchCurrentDateOnRender } from '../utilities';

export const AllGoalsScreen: NavigationStackScreenComponent = ({ navigation }) => {
  useDispatchCurrentDateOnRender();

  const handleEditActionInteraction = (goalId: string) => {
    navigation.navigate('EditGoal', { goalId });
  };

  const handleAddButtonPress = () => {
    navigation.navigate('AddGoal');
  };

  const description = 'Goals are tasks that you would like to track day by day, ' +
    'such as "writing for an hour every day" or "exercising Monday to Friday."';

  return (
    <>
      <ListHeader
        buttonTitle='Add Goal'
        buttonIconSource={Icons.goal}
        onButtonPress={handleAddButtonPress}
        description={description}
        descriptionButtonTitle='What are Goals?'
      />
      <AllGoals onEditActionInteraction={handleEditActionInteraction} />
    </>
  );
};
