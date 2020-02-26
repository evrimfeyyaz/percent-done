import React, { useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import {
  BackgroundView,
  ProjectForm,
  HeaderButton,
  HeaderCancelButton,
} from '../../components';
import { EditProjectForm } from '../../containers';
import { NavigationStackScreenComponent } from 'react-navigation-stack';

export const EditProjectScreen: NavigationStackScreenComponent = ({ navigation }) => {
  const formRef = useRef<ProjectForm>(null);

  const submitFormAndClose = () => {
    if (formRef?.current?.submit()) {
      navigation.goBack(null);
    }
  };

  useEffect(() => {
    navigation.setParams({
      headerRightOnPress: submitFormAndClose,
    });
  }, []);

  return (
    <BackgroundView style={styles.container}>
      {/*
      // @ts-ignore */}
      <EditProjectForm ref={formRef} projectId={navigation.getParam('projectId')} onDelete={() => navigation.goBack(null)} />
    </BackgroundView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
  },
});

EditProjectScreen.navigationOptions = ({ navigation }) => ({
  title: 'Edit Project',
  headerLeft: () => <HeaderCancelButton onPress={() => navigation.dismiss()} />,
  headerRight: () => <HeaderButton title='Save' onPress={navigation.getParam('headerRightOnPress')} primary />,
});
