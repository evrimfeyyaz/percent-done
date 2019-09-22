import React, { useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationScreenComponent } from 'react-navigation';
import {
  BackgroundView,
  GoalForm,
  HeaderButton,
  HeaderCancelButton,
} from '../components';
import { AddGoalForm } from '../containers';

export const AddGoalScreen: NavigationScreenComponent = ({ navigation }) => {
  const formRef = useRef<GoalForm>(null);

  const submitFormAndClose = () => {
    if (formRef != null && formRef.current != null) {
      formRef.current.submit();
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
      <AddGoalForm ref={formRef} />
    </BackgroundView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
  },
});

AddGoalScreen.navigationOptions = ({ navigation }) => ({
  title: 'Add Goal',
  headerLeft: (
    <HeaderCancelButton onPress={() => navigation.dismiss()} />
  ),
  headerRight: <HeaderButton title='Save' onPress={navigation.getParam('headerRightOnPress')} primary />,
});
