import React, { useEffect } from 'react';
import { NavigationStackScreenComponent } from 'react-navigation-stack';
import { AllProjects } from '../containers/AllProjects';
import { LayoutAnimation, View } from 'react-native';
import { ListHeader } from '../components';
import { Icons } from '../../assets';

export const AllProjectsScreen: NavigationStackScreenComponent = ({ navigation }) => {
  useEffect(() => {
    LayoutAnimation.easeInEaseOut();
  }, []);

  const handleEditActionInteraction = (projectId: string) => {
    navigation.navigate('EditProject', { projectId });
  };

  const handleButtonPress = () => {
    navigation.navigate('AddProject');
  };

  const description = 'Projects help you keep track of what you are specifically working on. ' +
    '\n\nFor example, you might have a "Write" goal, and you might have multiple projects such as ' +
    '"Blog Article" and "Novel."';

  return (
    <View>
      <ListHeader
        buttonTitle='Add Project'
        buttonIconSource={Icons.project}
        onButtonPress={handleButtonPress}
        description={description}
        descriptionButtonTitle='What are Projects?'
      />
      <AllProjects onEditActionInteraction={handleEditActionInteraction} />
    </View>
  );
};
