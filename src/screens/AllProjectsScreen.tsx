import React from 'react';
import { NavigationStackScreenComponent } from 'react-navigation-stack';
import { AllProjects } from '../containers/AllProjects';
import { View } from 'react-native';

export const AllProjectsScreen: NavigationStackScreenComponent = ({ navigation }) => {
  const handleEditActionInteraction = (projectId: string) => {
    navigation.navigate('EditProject', { projectId });
  };

  return (
    <View>
      <AllProjects onEditActionInteraction={handleEditActionInteraction} />
    </View>
  );
};
