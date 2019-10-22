import React, { useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import {
  BackgroundView,
  GoalForm,
  HeaderButton,
  HeaderCancelButton,
} from '../components';
import { EditGoalForm } from '../containers';
import { NavigationStackScreenComponent } from 'react-navigation-stack';

export const EditGoalScreen: NavigationStackScreenComponent = ({ navigation }) => {
  const formRef = useRef<GoalForm>(null);

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
      <EditGoalForm ref={formRef} goalId={navigation.getParam('goalId')} onDelete={() => navigation.goBack(null)} />
    </BackgroundView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
  },
});

EditGoalScreen.navigationOptions = ({ navigation }) => ({
  title: 'Edit Goal',
  headerLeft: (
    <HeaderCancelButton onPress={() => navigation.dismiss()} />
  ),
  headerRight: <HeaderButton title='Save' onPress={navigation.getParam('headerRightOnPress')} primary />,
});
