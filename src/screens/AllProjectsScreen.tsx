import React from 'react';
import { NavigationStackScreenComponent } from 'react-navigation-stack';
import { AllProjects } from '../containers/AllProjects';

export const AllProjectsScreen: NavigationStackScreenComponent = ({ navigation }) => {
  const handleEditActionInteraction = (projectId: string) => {
    navigation.navigate('EditProject', { projectId });
  };

  return <AllProjects onEditActionInteraction={handleEditActionInteraction} />;
};
